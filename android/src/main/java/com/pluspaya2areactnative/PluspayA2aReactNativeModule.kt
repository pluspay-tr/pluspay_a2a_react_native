package com.pluspaya2areactnative

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import org.json.JSONObject

/**
 * Thin native bridge for PlusPay POS+ App2App (A2A).
 *
 * It only transports raw JSON. Each [sendRequest] launches POS+ via an intent
 * and resolves the JS Promise when POS+ broadcasts back the result. All models
 * / serialization live in TypeScript.
 */
class PluspayA2aReactNativeModule(private val reactContext: ReactApplicationContext) :
  NativePluspayA2aReactNativeSpec(reactContext) {

  private var receiver: BroadcastReceiver? = null
  private var pendingPromise: Promise? = null

  private val resultAction: String
    get() = "${reactContext.packageName}.PLUSPAY_A2A_RESULT"

  override fun getName(): String = NAME

  override fun initialize(promise: Promise) {
    try {
      if (receiver == null) {
        receiver = object : BroadcastReceiver() {
          override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action != resultAction) return
            val response = intent.getStringExtra("response") ?: "{}"
            val p = pendingPromise
            pendingPromise = null
            p?.resolve(response)
          }
        }
        val filter = IntentFilter(resultAction)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
          reactContext.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
        } else {
          @Suppress("UnspecifiedRegisterReceiverFlag")
          reactContext.registerReceiver(receiver, filter)
        }
      }

      val info = JSONObject().apply {
        put("packageName", reactContext.packageName)
        put("activityName", reactContext.currentActivity?.componentName?.className ?: "")
      }
      promise.resolve(info.toString())
    } catch (e: Exception) {
      Log.e(TAG, "initialize failed", e)
      promise.reject("INIT_ERROR", e.message, e)
    }
  }

  override fun sendRequest(requestJson: String, promise: Promise) {
    // Only one request can be in flight; supersede any previous pending one.
    pendingPromise?.let { prev ->
      pendingPromise = null
      prev.reject("SUPERSEDED", "Request superseded by a new request.")
    }
    pendingPromise = promise

    try {
      val activity = reactContext.currentActivity
      val intent = Intent(ACTION_POS_A2A).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or
          Intent.FLAG_ACTIVITY_CLEAR_TOP or
          Intent.FLAG_ACTIVITY_SINGLE_TOP
        putExtra("request", requestJson)
        putExtra("resultAction", resultAction)
        putExtra("callerPackage", reactContext.packageName)
        putExtra("callerActivity", activity?.javaClass?.name ?: "")
      }
      if (activity != null) {
        activity.startActivity(intent)
      } else {
        reactContext.startActivity(intent)
      }
    } catch (e: Exception) {
      pendingPromise = null
      promise.reject("LAUNCH_INTENT_ERROR", e.message, e)
    }
  }

  override fun dispose(promise: Promise) {
    try {
      receiver?.let {
        try {
          reactContext.unregisterReceiver(it)
        } catch (_: Exception) {
          // already unregistered
        }
      }
      receiver = null
      pendingPromise = null
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("DISPOSE_ERROR", e.message, e)
    }
  }

  companion object {
    const val NAME = NativePluspayA2aReactNativeSpec.NAME
    private const val ACTION_POS_A2A = "com.pluspay.POS_A2A"
    private const val TAG = "PluspayA2aRN"
  }
}
