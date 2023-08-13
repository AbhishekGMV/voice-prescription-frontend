import React from "react";
import Homepage from "./../Pages/Homepage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageNotFound from "./../components/PageNotFound";
import PatientLogin from "./../Pages/Patient/PatientLogin";
import PatientRegister from "./../Pages/Patient/PatientRegister";
import PatientDashboard from "./../Pages/Patient/PatientDashboard";
import ProcessPrescription from "./../Pages/Doctor/ProcessPrescription";
import PatientAppointment from "./../Pages/Patient/PatientAppointment";
import BookingPage from "./../Pages/Patient/BookingPage";
import BookingSummary from "./../Pages/Patient/BookingSummary";
import BookDoctor from "./../Pages/Patient/BookDoctor";
import DoctorLogin from "./../Pages/Doctor/DoctorLogin";
import DoctorRegister from "./../Pages/Doctor/DoctorRegister";
import Doctor from "./../Pages/Doctor/DoctorList";
import DoctorDashboard from "./../Pages/Doctor/DoctorDashboard";
import DoctorAppointment from "../Pages/Doctor/DoctorAppointment";
import AddPatient from "../Pages/Doctor/AddPatient";
// import AudioInput from "./AudioInput";

function App() {
  return (
    <div>
      {/* <AudioInput /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/patient/login" exact element={<PatientLogin />} />
          <Route path="/patient/register" exact element={<PatientRegister />} />
          <Route path="/patient/:pid" exact element={<PatientDashboard />} />
          <Route
            path="/patient/:pid/appointment"
            exact
            element={<PatientAppointment />}
          />
          <Route path="/patient/:pid/doctors-list" exact element={<Doctor />} />
          <Route path="/patient/:pid/booking" exact element={<BookingPage />} />
          <Route
            path="/patient/:pid/booking-summary"
            exact
            element={<BookingSummary />}
          />
          <Route
            path="/patient/:pid/book-doctor"
            exact
            element={<BookDoctor />}
          />
          <Route path="/doctor/login" exact element={<DoctorLogin />} />
          <Route path="/doctor/register" exact element={<DoctorRegister />} />
          <Route
            path="/doctor/:did/appointment"
            exact
            element={<DoctorAppointment />}
          />
          <Route
            path="/doctor/:did/add-patient"
            exact
            element={<AddPatient />}
          />
          <Route
            path="/doctor/:did/process-prescription/:did"
            exact
            element={<ProcessPrescription />}
          />
          <Route path="/doctor/:did" exact element={<DoctorDashboard />} />
          <Route path="/404" element={<PageNotFound />} />
          <Route element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
