// lib/services/firebase_service.dart

import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/class_session.dart';

class FirebaseService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<void> createClassSession(ClassSession session) async {
    try {
      print("➡️ Writing to Firestore...");
      print("Session Data: ${session.toMap()}");

      await _firestore.collection('class_sessions').add(session.toMap());

      print("✅ Firestore write success");
    } catch (e, stack) {
      print("❌ Firestore write FAILED: $e");
      print("STACK TRACE: $stack");
      throw Exception("Failed Firestore write: $e");
    }
  }
}
