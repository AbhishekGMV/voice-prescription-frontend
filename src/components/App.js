import React from "react";
import Homepage from "./Homepage";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PatientLogin from "./PatientLogin";
import PatientRegister from "./PatientRegister";
import DoctorLogin from "./DoctorLogin";
import DoctorRegister from "./DoctorRegister";
import PatientDashboard from "./PatientDashboard";
import ProcessPrescription from "./ProcessPrescription";
import PageNotFound from "./PageNotFound";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/patient/login" exact component={PatientLogin} />
          <Route path="/patient/register" exact component={PatientRegister} />
          <Route path="/doctor/login" exact component={DoctorLogin} />
          <Route path="/doctor/register" exact component={DoctorRegister} />
          <Route path="/patient/:id" exact component={PatientDashboard} />
          <Route
            path="/doctor/process-prescription"
            exact
            component={ProcessPrescription}
          />
          <Route path="/404" component={PageNotFound} />
          <Route component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;
