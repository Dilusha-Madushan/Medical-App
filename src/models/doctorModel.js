const { db } = require('../config/firebaseConfig');

const doctorCollection = db.collection('doctors');

function capitalizeFirstLetter(word) {
    if (!word) return ''; // Handle empty string case
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

exports.getDoctorById = async (doctorId) => {
    try {
        const doc = await doctorCollection.doc(doctorId).get();
        if (doc.exists) {
            return { error: false, data: doc.data() };
        }
        return { error: true, message: 'Doctor not found' };
    } catch (error) {
        console.error('Error getting doctor:', error);
        return { error: true, message: error.message };
    }
};

exports.getAllDoctors = async (name, category) => {
    let query = doctorCollection;

    if (name) query = query.where('name', '==', name);
    if (category) query = query.where('title', '==', capitalizeFirstLetter(category));

    // const offset = (page - 1) * limit;
    const snapshot = await query.get();
    const doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const total = (await query.get()).size;

    return { doctors, total };
};