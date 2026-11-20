package nl.timvanbergen.toko

import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import android.content.BroadcastReceiver
import android.content.Context
import android.content.IntentFilter
import android.content.Intent
import android.content.res.Configuration
import android.graphics.Color
import android.graphics.RectF
import android.os.Build
import android.os.Bundle
import android.view.HapticFeedbackConstants
import android.view.View
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.annotation.RequiresApi
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import nl.timvanbergen.toko.glass.GlassBar
import nl.timvanbergen.toko.glass.GlassMenu
import nl.timvanbergen.toko.glass.records.GlassMenuItemRecord
import org.json.JSONObject

/**
 * Toko als app. De winkel zit in de app zelf (assets/www) en wordt onder het eigen webadres getoond;
 * alleen /api gaat naar de server. Installeren, openen en verwijderen doet [Installer].
 * De navigatiebalk en de menu's zijn glas van de app zelf (Android 13+), de rest van de pagina blijft plat.
 */
class MainActivity : ComponentActivity() {

    private lateinit var web: WebView
    private lateinit var bars: WindowInsetsControllerCompat
    private var glassMenu: GlassMenu? = null
    @Volatile private var insetTop = 0f
    @Volatile private var insetBottom = 0f

    private var pageReady = false

    // Iets geïnstalleerd, bijgewerkt of verwijderd (ook buiten Toko om): de pagina kijkt opnieuw.
    private val pakketten = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) = js("window.tokoVeranderd && tokoVeranderd()")
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Tekenen tot onder status- en navigatiebalk; de pagina houdt zelf die ruimte vrij.
        WindowCompat.setDecorFitsSystemWindows(window, false)
        @Suppress("DEPRECATION")
        window.statusBarColor = Color.TRANSPARENT
        @Suppress("DEPRECATION")
        window.navigationBarColor = Color.TRANSPARENT
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.isNavigationBarContrastEnforced = false
            @Suppress("DEPRECATION")
            window.isStatusBarContrastEnforced = false
        }

        val root = FrameLayout(this)
        web = WebView(this)
        root.addView(web, FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))
        setContentView(root)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            glassMenu = GlassMenu(window.decorView as ViewGroup)
        }

        val night = (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES
        bars = WindowCompat.getInsetsController(window, root)
        setDarkBars(night)

        ViewCompat.setOnApplyWindowInsetsListener(root) { view, insets ->
            val sys = insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())
            val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
            val density = resources.displayMetrics.density
            // Toetsenbord open: de WebView krimpt, zodat je altijd ziet wat je typt.
            view.setPadding(sys.left, 0, sys.right, ime.bottom)
            insetTop = sys.top / density
            insetBottom = if (ime.bottom > 0) 0f else sys.bottom / density
            pushInsets()
            WindowInsetsCompat.CONSUMED
        }

        CookieManager.getInstance().setAcceptCookie(true)
        web.setBackgroundColor(getColor(R.color.page_bg))
        web.overScrollMode = View.OVER_SCROLL_NEVER
        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            setSupportZoom(false)
            builtInZoomControls = false
            userAgentString = "$userAgentString TokoApp/${Updater.currentName(this@MainActivity)}"
        }
        web.addJavascriptInterface(Bridge(), "TokoNative")
        web.webChromeClient = WebChromeClient()
        web.webViewClient = Client()

        // Terug-knop: eerst menu, paneel of zoekopdracht sluiten, anders de app wegzetten.
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                web.evaluateJavascript("window.tokoBack ? window.tokoBack() : false") { handled ->
                    if (handled != "true") moveTaskToBack(true)
                }
            }
        })

        huidige = this
        registerReceiver(pakketten, IntentFilter().apply {
            addAction(Intent.ACTION_PACKAGE_ADDED)
            addAction(Intent.ACTION_PACKAGE_REMOVED)
            addAction(Intent.ACTION_PACKAGE_REPLACED)
            addDataScheme("package")
        })
        if (savedInstanceState != null) web.restoreState(savedInstanceState) else web.loadUrl(HOME)
        Updater.checkQuietly(this)
    }

    /** Stukje JavaScript in de pagina, vanaf elke draad. */
    fun js(code: String) = runOnUiThread { if (!isDestroyed) web.evaluateJavascript(code, null) }

    fun voortgang(id: String, deel: Float) = js("window.tokoVoortgang && tokoVoortgang(${JSONObject.quote(id)}, $deel)")

    fun klaar(id: String, ok: Boolean, bericht: String) =
        js("window.tokoKlaar && tokoKlaar(${JSONObject.quote(id)}, $ok, ${JSONObject.quote(bericht)})")

    private fun setDarkBars(dark: Boolean) {
        bars.isAppearanceLightStatusBars = !dark
        bars.isAppearanceLightNavigationBars = !dark
    }

    private fun pushInsets() {
        web.evaluateJavascript(
            "(function(r){r.setProperty('--sat','${insetTop}px');r.setProperty('--sab','${insetBottom}px');})(document.documentElement.style);" +
                "window.dispatchEvent(new Event('resize'))",
            null
        )
    }

    private fun windowRect(box: JSONObject): RectF {
        val density = resources.displayMetrics.density
        val origin = IntArray(2).also { web.getLocationInWindow(it) }
        val left = origin[0] + box.getDouble("x").toFloat() * density
        val top = origin[1] + box.getDouble("y").toFloat() * density
        return RectF(left, top, left + box.getDouble("w").toFloat() * density, top + box.getDouble("h").toFloat() * density)
    }

    /** Opent het glazen menu vanuit een knop in de pagina (positie in CSS-pixels). */
    @RequiresApi(Build.VERSION_CODES.TIRAMISU)
    private fun showGlassMenu(menu: JSONObject) {
        val rows = menu.getJSONArray("items")
        val items = List(rows.length()) { i ->
            val row = rows.getJSONObject(i)
            GlassMenuItemRecord(
                id = row.optString("id"),
                title = row.optString("title"),
                subtitle = row.optString("subtitle").ifEmpty { null },
                icon = row.optString("icon").ifEmpty { null },
                checked = if (row.has("checked")) row.optBoolean("checked") else null,
                destructive = row.optBoolean("destructive"),
                disabled = row.optBoolean("disabled"),
                separator = row.optBoolean("separator"),
                heading = row.optBoolean("heading"),
            )
        }
        glassMenu?.show(windowRect(menu), items, menu.optBoolean("dark")) { id ->
            web.evaluateJavascript("window.tokoGlassPick && tokoGlassPick(${JSONObject.quote(id)})", null)
        }
    }

    /** De zwevende glazen navigatie; de pagina meet zelf waar die hoort te staan. */
    @RequiresApi(Build.VERSION_CODES.TIRAMISU)
    private fun showGlassBar(bar: JSONObject) {
        val tabs = bar.getJSONArray("tabs")
        glassMenu?.setBar(
            windowRect(bar.getJSONObject("pill")),
            windowRect(bar.getJSONObject("add")),
            List(tabs.length()) { i ->
                val tab = tabs.getJSONObject(i)
                GlassBar.Tab(tab.getString("id"), tab.getString("title"), tab.getString("icon"))
            },
            bar.getString("active"),
            bar.optBoolean("dark"),
            bar.optBoolean("visible", true),
        ) { id ->
            web.evaluateJavascript("window.tokoGlassNav && tokoGlassNav(${JSONObject.quote(id)})", null)
        }
    }

    /** Update is gedownload: zeggen dat hij erin gaat zodra je de app wegzet. */
    fun updateReady(name: String) {
        web.evaluateJavascript(
            "window.tokoToast && tokoToast(${JSONObject.quote("Toko $name staat klaar en wordt geïnstalleerd zodra je de app sluit")})",
            null
        )
    }

    private fun onOurSite(): Boolean = web.url?.let { android.net.Uri.parse(it).host == HOST } ?: false

    override fun onResume() {
        super.onResume()
        inFront = true
        Updater.resume(this)
        Installer.verder(this)
        Updater.checkQuietly(this)
        js("window.tokoVeranderd && tokoVeranderd()")
    }

    override fun onPause() {
        super.onPause()
        inFront = false
        CookieManager.getInstance().flush()
    }

    override fun onStop() {
        super.onStop()
        // Pas installeren als de app weg is: dan wordt niemand midden in het installeren van iets anders onderbroken.
        Updater.installIfReady(this)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        web.saveState(outState)
    }

    override fun onDestroy() {
        if (huidige === this) huidige = null
        runCatching { unregisterReceiver(pakketten) }
        web.destroy()
        super.onDestroy()
    }

    /** Wat de pagina van de app mag vragen. */
    private inner class Bridge {

        @JavascriptInterface
        fun insets(): String = "$insetTop,$insetBottom"

        @JavascriptInterface
        fun setDark(dark: Boolean) {
            runOnUiThread { if (onOurSite()) setDarkBars(dark) }
        }

        @JavascriptInterface
        fun haptic(kind: String) {
            runOnUiThread {
                if (!onOurSite()) return@runOnUiThread
                val effect = when {
                    kind == "confirm" && Build.VERSION.SDK_INT >= Build.VERSION_CODES.R -> HapticFeedbackConstants.CONFIRM
                    kind == "reject" && Build.VERSION.SDK_INT >= Build.VERSION_CODES.R -> HapticFeedbackConstants.REJECT
                    kind == "long" -> HapticFeedbackConstants.LONG_PRESS
                    else -> HapticFeedbackConstants.CLOCK_TICK
                }
                web.performHapticFeedback(effect)
            }
        }

        /** Of de glazen navigatie en menu's kunnen (Android 13+). */
        @JavascriptInterface
        fun glassUi(): Boolean = Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU

        /** Geeft false terug als het hier niet kan; de pagina toont dan haar eigen menu. */
        @JavascriptInterface
        fun glassMenu(json: String): Boolean {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return false
            val menu = JSONObject(json)
            runOnUiThread { if (onOurSite()) showGlassMenu(menu) }
            return true
        }

        @JavascriptInterface
        fun glassBar(json: String) {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return
            val bar = JSONObject(json)
            runOnUiThread { if (onOurSite()) showGlassBar(bar) }
        }

        /** De pagina is klaar: melden als Toko net is bijgewerkt. */
        @JavascriptInterface
        fun ready() {
            runOnUiThread {
                pageReady = true
                Updater.justUpdated(this@MainActivity)?.let { name ->
                    web.evaluateJavascript("window.tokoToast && tokoToast(${JSONObject.quote("Toko is bijgewerkt naar versie $name")})", null)
                }
            }
        }

        /** Welke van deze pakketten staan er al, met versie. */
        @JavascriptInterface
        fun installed(json: String): String = Installer.geinstalleerd(this@MainActivity, json)

        @JavascriptInterface
        fun install(id: String, url: String, pakket: String, naam: String) {
            if (!url.startsWith("https://github.com/timmmmmmmmn/")) return klaar(id, false, "Onbekende bron")
            runOnUiThread { if (onOurSite()) Installer.installeer(this@MainActivity, id, url, pakket, naam) }
        }

        @JavascriptInterface
        fun open(pakket: String): Boolean = Installer.open(this@MainActivity, pakket)

        @JavascriptInterface
        fun uninstall(pakket: String) {
            runOnUiThread { if (onOurSite()) Installer.verwijder(this@MainActivity, pakket) }
        }

        @JavascriptInterface
        fun appVersion(): String = Updater.currentName(this@MainActivity)

        @JavascriptInterface
        fun checkForUpdate() {
            runOnUiThread { if (onOurSite()) Updater.check(this@MainActivity, manual = true) }
        }
    }

    private inner class Client : WebViewClient() {

        override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
            val url = request.url
            if (url.host != HOST || request.method != "GET") return null
            val path = url.path ?: "/"
            if (path.startsWith("/api/") || path.startsWith("/lumia/") || path.startsWith("/download/")) return null
            return Bundel.serve(this@MainActivity, if (path == "/" || path.isEmpty()) "/index.html" else path, null)
        }

        // Links naar andere sites openen in de browser.
        override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
            if (request.url.host == HOST && request.url.path?.startsWith("/lumia") != true) return false
            try {
                startActivity(Intent(Intent.ACTION_VIEW, request.url))
            } catch (_: ActivityNotFoundException) {
            }
            return true
        }

        override fun onPageStarted(view: WebView, url: String?, favicon: android.graphics.Bitmap?) {
            pageReady = false
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) glassMenu?.hideBar()
        }

        override fun onPageCommitVisible(view: WebView, url: String?) = pushInsets()

        override fun onPageFinished(view: WebView, url: String?) {
            pushInsets()
            CookieManager.getInstance().flush()
        }
    }

    companion object {
        private const val HOST = "toko.timvanbergen.nl"
        private const val HOME = "https://$HOST/"
        @Volatile var inFront = false
        @Volatile var huidige: MainActivity? = null
    }
}
