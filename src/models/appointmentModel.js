const { db } = require('../config/firebaseConfig');

const getUserFirstName = async (userId) => {
    const userSnapshot = await db.collection('users').doc(userId).get();
    if (userSnapshot.exists) {
        return userSnapshot.data().firstName;
    }
    return null;
};

const getDoctorName = async (doctorId) => {
    const userSnapshot = await db.collection('doctors').doc(doctorId).get();
    if (userSnapshot.exists) {
        return userSnapshot.data().name;
    }
    return null;
};


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
        .get();

    const data = await Promise.all(snapshot.docs.map(async (doc) => {
        const appointment = { id: doc.id, ...doc.data() };
        if (appointment.status != 'ended'){
            appointment.patientName = await getUserFirstName(appointment.patientId);
            return appointment;
        }
    }));

    return data.sort((a, b) => new Date(a.appointmentStart) - new Date(b.appointmentStart));
};

exports.getAppointmentsByPatient = async (patientId) => {
    const snapshot = await db.collection('appointments')
        .where('patientId', '==', patientId)
        .get();

    console.log("came 2")

    const data = await Promise.all(snapshot.docs.map(async (doc) => {
        const appointment = { id: doc.id, ...doc.data() };
        if (appointment.status != 'ended'){
            appointment.doctorName = await getDoctorName(appointment.doctorId);
            return appointment;
        }
        
    }));

    return data.sort((a, b) => new Date(a.appointmentStart) - new Date(b.appointmentStart));
};


exports.getAppointmentByPatient = async (patientId, appointmentId) => {
    const appointmentDoc = await db.collection('appointments').doc(appointmentId).get();
    if (appointmentDoc.exists) {
        const appointment = appointmentDoc.data();
        if (appointment.patientId === patientId) {
            appointment.doctorName = await getDoctorName(appointment.doctorId);
            return { id: appointmentDoc.id, ...appointment };
        }
    }
    return null;
};


exports.getAppointmentByDoctor = async (doctorId, appointmentId) => {
    const appointmentDoc = await db.collection('appointments').doc(appointmentId).get();
    if (appointmentDoc.exists) {
        const appointment = appointmentDoc.data();
        if (appointment.doctorId === doctorId) {
            appointment.patientName = await getUserFirstName(appointment.patientId);
            return { id: appointmentDoc.id, ...appointment };
        }
    }
    return null;
};
