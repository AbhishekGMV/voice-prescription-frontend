import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Card} from "react-bootstrap";
import "./../styles/homepage.css";
import doc from "./../images/docc.jpeg";
import pat from "./../images/patt.jpeg";

export default function Homepage() {
  return (
    <><div className="backk">
    <center>
    
    <div className="container">
    <div className="flexx">
    <Card style={{ width: "30rem", height:"30rem" }}>
      <Card.Body>
        <img src={pat} width="400px" height="400px"></img>
        <Card.Text><button type="button" className="rand"  ><a href="/patient/login">Patient Login </a>
        
        </button>
        </Card.Text>
      </Card.Body>
    </Card>
    <Card style={{ width: "30rem",height:"30rem", marginLeft:"50px" }}>
      <Card.Body>
        <img src={doc} width="400px" height="400px"></img>
        <Card.Text><button type="button" className="rand" ><a href="/doctor/login">Doctor Login  </a>
        </button>
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
      
      
    </div>
    </center> </div>
    </>
  );
}
