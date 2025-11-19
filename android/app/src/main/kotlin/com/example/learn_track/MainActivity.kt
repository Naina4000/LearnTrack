package com.example.learn_track

import android.content.Context
import android.net.wifi.WifiManager
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {

    private val CHANNEL = "learntrack/hotspot"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(
            flutterEngine.dartExecutor.binaryMessenger,
            CHANNEL
        ).setMethodCallHandler { call, result ->

            when (call.method) {
                "isHotspotEnabled" -> {
                    val wifiManager = applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
                    
                    try {
                        val method = wifiManager.javaClass.getDeclaredMethod("isWifiApEnabled")
                        method.isAccessible = true
                        val isEnabled = method.invoke(wifiManager) as Boolean
                        result.success(isEnabled)
                    } catch (e: Exception) {
                        result.error("HOTSPOT_ERROR", e.localizedMessage, null)
                    }
                }

                else -> result.notImplemented()
            }
        }
    }
}
