

class ClassSession {
  final String teacherName;
  final String subject;
  final String date;
  final String time;
  final String ssid; 

  ClassSession({
    required this.teacherName,
    required this.subject,
    required this.date,
    required this.time,
    required this.ssid,
  });

  Map<String, dynamic> toMap() {
    return {
      'teacherName': teacherName,
      'subject': subject,
      'date': date,
      'time': time,
      'ssid': ssid,
    };
  }
}
