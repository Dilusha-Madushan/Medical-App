const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const patientController = require('../controllers/patientController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Middleware to ensure the user is authenticated and is a patient
router.use(verifyToken);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads'); // Ensure this path is correct
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + file.originalname;
      cb(null, uniqueSuffix);
    },
  });
  
const upload = multer({ storage: storage });

/**
 * @openapi
 * /patient/doctors:
 *   get:
 *     tags:
 *       - Patients
 *     summary: List all available doctors
 *     description: Retrieve a list of all doctors available for booking appointments.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of available doctors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doctor'
 */
router.get('/doctors', patientController.listDoctors);

/**
 * @openapi
 * /patient/appointments/book:
 *   post:
 *     tags:
 *       - Patients
 *     summary: Book an appointment
 *     description: Book an appointment with a specific doctor at a given time.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment booked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     appointmentId:
 *                       type: string
 */
router.post('/appointments/book', upload.single('file'), patientController.bookAppointment);

/**
 * @openapi
 * /patients/appointments/cancel/{id}:
 *   delete:
 *     tags:
 *       - Patients
 *     summary: Cancel an appointment
 *     description: Cancel a previously booked appointment using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment canceled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 */
router.delete('/appointments/cancel/:id', patientController.cancelAppointment);

/**
 * @openapi
 * /patients/medical-records/upload:
 *   post:
 *     tags:
 *       - Patients
 *     summary: Upload medical data
 *     description: Upload images or PDFs of medical data to Firebase Storage.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Medical record uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     url:
 *                       type: string
 */
router.post('/medical-records/upload', patientController.uploadMedicalRecord);

/**
 * @openapi
 * /patients/dashboard:
 *   get:
 *     tags:
 *       - Patients
 *     summary: Get patient dashboard statistics
 *     description: Retrieve statistics for the patient dashboard, such as upcoming appointments.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 */
router.get('/dashboard', patientController.getDashboardStats);

/**
 * @openapi
 * /patients/profile:
 *   get:
 *     tags:
 *       - Patients
 *     summary: Get patient profile details
 *     description: Retrieve details of the patient's profile.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient profile details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PatientProfile'
 */
router.get('/profile', patientController.getProfileDetails);

/**
 * @openapi
 * /patients/profile/update:
 *   put:
 *     tags:
 *       - Patients
 *     summary: Update patient profile details
 *     description: Update specific details of the patient's profile.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dob:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 */
router.put('/profile/update', patientController.updateProfileDetails);

/**
 * @openapi
 * /patients/medical-records:
 *   get:
 *     tags:
 *       - Patients
 *     summary: Get list of medical records metadata
 *     description: Retrieve metadata for all medical records associated with the logged-in patient.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of medical records metadata.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: File name of the medical record.
 *                       size:
 *                         type: string
 *                         description: Size of the file.
 *                       contentType:
 *                         type: string
 *                         description: MIME type of the file.
 *                       updateTime:
 *                         type: string
 *                         description: Last updated time of the file.
 *       500:
 *         description: Failed to retrieve medical records metadata.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.get('/medical-records', patientController.getMedicalRecords);

/**
 * @openapi
 * /patients/medical-records/download:
 *   get:
 *     tags:
 *       - Patients
 *     summary: Download a specific medical record
 *     description: Download a specific medical record file based on the file name.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to download.
 *     responses:
 *       200:
 *         description: Successfully downloaded the medical record file.
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Filename not provided.
 *       500:
 *         description: Failed to download the file.
 */
router.get('/medical-records/download/:id', patientController.downloadMedicalRecord);

router.get('/appointments/all', patientController.getAllAppointments);

router.get('/appointments/:id', patientController.getAppointment);

module.exports = router;