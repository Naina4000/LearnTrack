// lib/screens/teacher_portal.dart

import 'package:flutter/material.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:intl/intl.dart';
import 'package:network_info_plus/network_info_plus.dart';
import 'package:android_intent_plus/android_intent.dart';
import 'package:flutter/services.dart';

import '../models/class_session.dart';
import '../services/firebase_service.dart';

class TeacherPortal extends StatefulWidget {
  const TeacherPortal({super.key});

  @override
  State<TeacherPortal> createState() => _TeacherPortalState();
}

class _TeacherPortalState extends State<TeacherPortal> {
  final FirebaseService _firebaseService = FirebaseService();
  final NetworkInfo _networkInfo = NetworkInfo();

  static const platform = MethodChannel("learntrack/hotspot");

  String wifiStatus = "Checking...";
  bool hotspotReady = false;
  String ssid = "Unknown";
  bool checking = false;

  @override
  void initState() {
    super.initState();
    _checkPermissions();
  }

  Future<void> _checkPermissions() async {
    await Permission.location.request();
    await Permission.nearbyWifiDevices.request();
    await _checkConnectivityStatus();
  }

  /// REAL HOTSPOT DETECTION (Platform Channel → Android)
  Future<bool> _isHotspotEnabled() async {
    try {
      final result = await platform.invokeMethod("isHotspotEnabled");
      return result == true;
    } catch (e) {
      return false;
    }
  }

  Future<void> _checkConnectivityStatus() async {
    setState(() {
      checking = true;
      wifiStatus = "Checking...";
      hotspotReady = false;
    });

    final connectivityResult = await Connectivity().checkConnectivity();
    String? wifiName;
    String? ipAddress;

    try {
      wifiName = await _networkInfo.getWifiName();
      ipAddress = await _networkInfo.getWifiIP();
    } catch (_) {
      wifiName = null;
      ipAddress = null;
    }

    bool hotspotEnabled = await _isHotspotEnabled();

    setState(() {
      ssid = (wifiName == null || wifiName.isEmpty) ? "HOTSPOT" : wifiName;


      if (hotspotEnabled) {
        wifiStatus = "Hotspot Active";
        hotspotReady = true;
      } else if (connectivityResult == ConnectivityResult.wifi && wifiName != null) {
        wifiStatus = "Connected to Wi-Fi: $ssid (Turn ON Hotspot)";
        hotspotReady = false;
      } else {
        wifiStatus = "Hotspot OFF";
        hotspotReady = false;
      }

      checking = false;
    });
  }

  Future<void> _openHotspotSettings() async {
    const intent = AndroidIntent(action: 'android.settings.TETHER_SETTINGS');
    await intent.launch();
  }

  Future<void> _startClass() async {
    if (!hotspotReady) return;

    final now = DateTime.now();
    final formattedDate = DateFormat('dd-MM-yyyy').format(now);
    final formattedTime = DateFormat('hh:mm a').format(now);

    final session = ClassSession(
      teacherName: "Prof. Sharma",
      subject: "Network Fundamentals",
      date: formattedDate,
      time: formattedTime,
      ssid: ssid,
    );

    try {
      await _firebaseService.createClassSession(session);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Class session started & saved.')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to start session: $e')),
      );
    }
  }

  Widget _statusCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.indigo.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.indigo.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Connection Status', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(
                hotspotReady ? Icons.check_circle : Icons.info_outline,
                color: hotspotReady ? Colors.green : Colors.orange,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  wifiStatus,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text('SSID: $ssid', style: const TextStyle(fontSize: 13)),
        ],
      ),
    );
  }

  Widget _primaryButton({
    required String label,
    required IconData icon,
    required VoidCallback? onPressed,
    bool large = false,
  }) {
    return SizedBox(
      width: double.infinity,
      height: large ? 54 : 44,
      child: ElevatedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, size: large ? 22 : 18),
        label: Text(label, style: TextStyle(fontSize: large ? 16 : 14)),
        style: ElevatedButton.styleFrom(
          backgroundColor: onPressed != null ? Colors.indigoAccent : Colors.grey,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.indigo.shade50,
      appBar: AppBar(
        title: const Text('LearnTrack - Teacher Portal'),
        backgroundColor: Colors.indigoAccent,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(18.0),
          child: Column(
            children: [
              const SizedBox(height: 8),
              const Text(
                'Hotspot & Class Control',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              checking ? const LinearProgressIndicator() : const SizedBox(height: 6),
              const SizedBox(height: 12),
              _statusCard(),
              const SizedBox(height: 18),
              _primaryButton(
                label: 'Refresh Connection Status',
                icon: Icons.refresh,
                onPressed: _checkConnectivityStatus,
              ),
              const SizedBox(height: 12),
              _primaryButton(
                label: 'Open Hotspot Settings',
                icon: Icons.settings,
                onPressed: _openHotspotSettings,
              ),
              const Spacer(),
              _primaryButton(
                label: 'Start Class',
                icon: Icons.wifi_tethering,
                onPressed: hotspotReady ? _startClass : null,
                large: true,
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}
