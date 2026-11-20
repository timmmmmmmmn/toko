package nl.timvanbergen.toko

import android.app.Activity
import android.app.AlertDialog
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInstaller
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL

/**
 * Apps uit de winkel: downloaden (met voortgang naar de pagina), installeren via PackageInstaller,
 * en kijken welke versie er al staat. De uitslag komt binnen in [InstallReceiver].
 */
object Installer {

    private data class Klus(val id: String, val url: String, val pakket: String, val naam: String)

    private var wachtOpToestemming = mutableListOf<Klus>()

    /** Welke van deze pakketten staan er, met welke versie: {"pakket": {"naam": "1.0.8", "code": 8}}. */
    fun geinstalleerd(context: Context, json: String): String {
        val uit = JSONObject()
        val lijst = runCatching { JSONArray(json) }.getOrNull() ?: return "{}"
        for (i in 0 until lijst.length()) {
            val pakket = lijst.optString(i)
            val info = try { context.packageManager.getPackageInfo(pakket, 0) } catch (_: PackageManager.NameNotFoundException) { continue }
            uit.put(pakket, JSONObject().put("naam", info.versionName ?: "").put("code", info.longVersionCode))
        }
        return uit.toString()
    }

    fun installeer(activity: MainActivity, id: String, url: String, pakket: String, naam: String) {
        val klus = Klus(id, url, pakket, naam)
        if (!activity.packageManager.canRequestPackageInstalls()) {
            // Eenmalig: Android vraagt of Toko apps mag installeren. Daarna gaat het vanzelf.
            if (wachtOpToestemming.none { it.id == id }) wachtOpToestemming.add(klus)
            if (wachtOpToestemming.size > 1) return
            AlertDialog.Builder(activity, android.R.style.Theme_DeviceDefault_Dialog_Alert)
                .setTitle("Apps installeren toestaan")
                .setMessage("Zet in het volgende scherm \"Toestaan van deze bron\" aan. Daarna kan Toko apps installeren en bijwerken.")
                .setPositiveButton("Naar instellingen") { _, _ ->
                    activity.startActivity(Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:${activity.packageName}")))
                }
                .setNegativeButton("Annuleren") { _, _ ->
                    wachtOpToestemming.forEach { activity.klaar(it.id, false, "") }
                    wachtOpToestemming.clear()
                }
                .setCancelable(false)
                .show()
            return
        }
        start(activity, klus)
    }

    /** Terug in Toko na het geven van toestemming: de wachtende apps alsnog installeren. */
    fun verder(activity: MainActivity) {
        if (wachtOpToestemming.isEmpty() || !activity.packageManager.canRequestPackageInstalls()) return
        val lijst = wachtOpToestemming.toList()
        wachtOpToestemming.clear()
        lijst.forEach { start(activity, it) }
    }

    private fun start(activity: MainActivity, klus: Klus) {
        Thread {
            val map = File(activity.cacheDir, "apk").apply { mkdirs() }
            val apk = File(map, "${klus.id}.apk")
            val fout = try {
                download(klus.url, apk) { deel -> activity.voortgang(klus.id, deel) }
                null
            } catch (e: Exception) {
                "Downloaden van ${klus.naam} mislukt. Heb je internet?"
            }
            if (fout != null) {
                activity.klaar(klus.id, false, fout)
                return@Thread
            }
            activity.voortgang(klus.id, -1f)
            try {
                commit(activity, apk, klus)
            } catch (e: Exception) {
                activity.klaar(klus.id, false, "Installeren van ${klus.naam} mislukt")
            }
        }.start()
    }

    private fun download(url: String, naar: File, voortgang: (Float) -> Unit) {
        val conn = URL(url).openConnection() as HttpURLConnection
        try {
            conn.instanceFollowRedirects = true
            conn.setRequestProperty("User-Agent", "TokoApp")
            conn.connectTimeout = 15_000
            conn.readTimeout = 60_000
            if (conn.responseCode != 200) throw IllegalStateException("HTTP ${conn.responseCode}")
            val totaal = conn.contentLengthLong
            var gehad = 0L
            var laatst = 0L
            conn.inputStream.use { input ->
                naar.outputStream().use { out ->
                    val buf = ByteArray(64 * 1024)
                    while (true) {
                        val n = input.read(buf)
                        if (n < 0) break
                        out.write(buf, 0, n)
                        gehad += n
                        val nu = System.currentTimeMillis()
                        if (totaal > 0 && nu - laatst > 120) {
                            laatst = nu
                            voortgang(gehad.toFloat() / totaal)
                        }
                    }
                }
            }
            voortgang(1f)
        } finally {
            conn.disconnect()
        }
    }

    private fun commit(context: Context, apk: File, klus: Klus) {
        val installer = context.packageManager.packageInstaller
        val params = PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL).apply {
            setAppPackageName(klus.pakket)
            // Vanaf Android 12 zonder extra bevestiging bij een update van een app die Toko zelf installeerde.
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                setRequireUserAction(PackageInstaller.SessionParams.USER_ACTION_NOT_REQUIRED)
            }
        }
        val bijwerken = runCatching { context.packageManager.getPackageInfo(klus.pakket, 0) }.isSuccess
        val id = installer.createSession(params)
        installer.openSession(id).use { session ->
            session.openWrite("${klus.id}.apk", 0, apk.length()).use { out ->
                apk.inputStream().use { it.copyTo(out) }
                session.fsync(out)
            }
            val flags = PendingIntent.FLAG_UPDATE_CURRENT or
                (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) PendingIntent.FLAG_MUTABLE else 0)
            val terug = Intent(context, InstallReceiver::class.java)
                .putExtra(InstallReceiver.EXTRA_ID, klus.id)
                .putExtra(InstallReceiver.EXTRA_NAAM, klus.naam)
                .putExtra(InstallReceiver.EXTRA_BIJWERKEN, bijwerken)
            session.commit(PendingIntent.getBroadcast(context, id, terug, flags).intentSender)
        }
        apk.deleteOnExit()
    }

    fun open(context: Context, pakket: String): Boolean {
        val intent = context.packageManager.getLaunchIntentForPackage(pakket) ?: return false
        return runCatching { context.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }.isSuccess
    }

    fun verwijder(activity: Activity, pakket: String) {
        @Suppress("DEPRECATION")
        runCatching { activity.startActivity(Intent(Intent.ACTION_DELETE, Uri.parse("package:$pakket"))) }
    }
}
