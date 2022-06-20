import React, { Component } from "react";
import Cookies from "universal-cookie";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { onLogin: false };
  }

  componentDidMount() {}

  openLogin = () => {
    if (!this.state.onLogin) {this.setState({ onLogin: true });
    let loginFrame = document.createElement("IFRAME");
    loginFrame.setAttribute(
      "src",
      "https://login.globo.com/login/438?url=http://globoesporte.globo.com/cartola-fc/&amp;tam=WIDGET"
    );
    loginFrame.classList.add("login_frame");
    loginFrame.setAttribute("frameborder", 0);
    loginFrame.style.boxSizing = "border-box";
    loginFrame.style.width = "100%";
    loginFrame.style.height = "100vh";
    document.getElementById("box_login_frame").appendChild(loginFrame);

    loginFrame.onload = () => {
      console.log(document.cookie);
    };}
    else {
      const cookies = new Cookies();
      console.log(cookies.getAll())
    }
  };

  onlyHcaptcha = () => {
    console.log("loading only hcaptcha");
  };

  render() {
    return (
      <div className="t-center">
        {(
          <div>
            <h1>{this.state.onLogin ? "Print cookies" : "Login try"}</h1>
            <button
              className="bt-login"
              onClick={() => {
                this.openLogin();
              }}
            >
              {this.state.onLogin ? "Print" : "Login"}
            </button>
          </div>
        )}
        <div id="box_login_frame"></div>
      </div>
    );
  }
}
