import React from "react";
require ('./LandingPage.css')

const LandingPageContent = props => {
  return (
    <div className="landingContent">
      <header>
        <h1>Clone Coding</h1>
        <div>
        <button>Sign In</button>
        <button>Register</button>
        </div>
      </header>
      <div className="topContent">
      <h2>Achieve mastery through challenge</h2>
      <div className="topText">
      <p>
       Clone Coding is the best platform to help you enhance your skills, expand your knowledge, and prepare for technical interviews.
      </p>
    <div className="topButtons">
      <button>Continue with Google</button>
      <button>Continue with Github</button>
      </div>
      </div>
      </div>
      <div className="body">
        <div>
        <h2>Attempt Code Challenges</h2>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged.
        </p>
        <div>
        <h2>Create Challenges and Tests</h2>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged.
        </p>
        </div>
        <div>
        <h2>Attempt Code Challenges</h2>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged.
        </p>
        </div>
      </div>
    </div>
    </div>
  );
};
export default LandingPageContent;