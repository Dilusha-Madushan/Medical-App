const { db } = require('../config/firebaseConfig');

exports.countActiveAppointments = async () => {
    const snapshot = await db.collection('appointments').where('status', '!=', 'ended').get();
    return snapshot.size;
};

exports.createAppointment = async (appointmentData) => {
    const docRef = await db.collection('appointments').add(appointmentData);
    return { id: docRef.id, ...appointmentData };
};

exports.updateAppointmentStatus = async (appointmentId, status) => {
    await db.collection('appointments').doc(appointmentId).update({ status });
};

exports.countAppointmentsByPatientAndStatus = async (patientId, status) => {
    const snapshot = await db.collection('appointments')
        .where('patientId', '==', patientId)
        .where('status', '==', status)
        .get();
    return snapshot.size;
};

exports.checkForConflictingAppointments = async (doctorId, date, startTime) => {
    const appointments = await db.collection('appointments')
        .where('doctorId', '==', doctorId)
        .where('date', '==', date)
        .where('startTime', '==', startTime)
        .get();

    return appointments.docs.some(appointment => {
        return true;
    });
};

exports.getAppointmentsByDoctor = async (doctorId) => {
    const snapshot = await db.collection('appointments')
        .where('doctorId', '==', doctorId)
        .where('status', '!=', 'ended')
        .get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return data.sort((a, b) => new Date(a.appointmentStart) - new Date(b.appointmentStart));
};

exports.getAppointmentsByPatient = async (patientId) => {
    const snapshot = await db.collection('appointments')
        .where('patientId', '==', patientId)
        .where('status', '!=', 'ended')
        .get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => new Date(a.appointmentStart) - new Date(b.appointmentStart));
};

exports.getAppointmentByPatient = async (patientId, appointmentId) => {
    const appointment = await db.collection('appointments').doc(appointmentId).get()
    if (appointment) {
        if (appointment.patientId == patientId){
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    }
    return NaN
    
};

exports.getAppointmentByDoctor = async (doctorId, appointmentId) => {
    const appointment = await db.collection('appointments').doc(appointmentId).get()
    if (appointment) {
        if (appointment.doctorId == doctorId){
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    }
    return NaN
    
};