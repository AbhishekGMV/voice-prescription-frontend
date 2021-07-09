import React from "react";
import Homepage from "./../Pages/Homepage";
import { BrowserRouter, Switch, Route } from "react-router-dom";
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
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/patient/login" exact component={PatientLogin} />
          <Route path="/patient/register" exact component={PatientRegister} />
          <Route path="/patient/:id" exact component={PatientDashboard} />
          <Route
            path="/patient/:id/appointment"
            exact
            component={PatientAppointment}
          />
          <Route path="/patient/:id/doctors-list" exact component={Doctor} />
          <Route path="/patient/:id/booking" exact component={BookingPage} />
          <Route
            path="/patient/:id/booking-summary"
            render={(props) => <BookingSummary {...props} />}
          />
          <Route
            path="/patient/:id/book-doctor"
            render={(props) => <BookDoctor {...props} />}
          />
          <Route path="/doctor/login" exact component={DoctorLogin} />
          <Route path="/doctor/register" exact component={DoctorRegister} />
          <Route
            path="/doctor/:id/appointment"
            exact
            component={DoctorAppointment}
          />
          <Route path="/doctor/:id/add-patient" exact component={AddPatient} />
          <Route
            path="/doctor/:id/process-prescription/:id"
            exact
            component={ProcessPrescription}
          />
          <Route path="/doctor/:id" exact component={DoctorDashboard} />
          <Route path="/404" component={PageNotFound} />
          <Route component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;
