import OtpInput from "react-otp-input";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
// import log from "electron-log";
const { ipcRenderer } = window.require("electron");
const log = window.require('electron-log')
const mac = log.scope("MacId")

const LicenseKey = () => {
  const [code, setCode] = useState("");
  const [macId, setMacId] = useState(null);
  const [run, setRun] = useState(false);
  const [error, setError] = useState(false);

  let navigate = useNavigate();



  useEffect(() => {
    if (typeof window !== "undefined") {
      ipcRenderer.on("sending", (event, arg) => {
        console.log("arg start", arg, "arg End");
        setMacId(arg);
      });
    }
    if (macId == null) {
      setRun(!run);
    } else {
      checkLiences(macId);
      log.info(`MACID: ${macId}`)
      console.log(macId);
    }
    // if (macId != null) {
    //   checkLiences(macId);
    // }
  }, [run]);

  const handleChange = (code) => {
    console.log(code, "code");
    setCode(code);
    setError(false);
  };

  const lisenseSubmit = async (e) => {
    e.preventDefault();
    console.log(code.length);
    const d = {
      key: code,
      macId,
    };
    try {
      if (code.length < 16) return setError(true);
      const { data } = await axios.post(
        "https://beta.imageproof.ai/api/activate-key", d);
      console.log(data);
      console.log(data.findedKey.macId)
      if (data.success) {
        console.log("working");
        swal({
          title: "success",
          text: data.msg,
          button: "OK!",
          icon: "success",
        });
        log.info(`License Key Verification ${data.findedKey.macId}`);
        navigate("/login", { state: data.findedKey.macId });
      } else {
        log.error(`License Key Verification: ${data.msg}`)
        swal({
          title: "error",
          text: data.msg,
          button: "OK!",
          icon: "error",
        });
      }
    } catch (error) {
      log.error(`${error}`)
      return console.log(error);
    }
  };

  const checkLiences = async (machineId) => {
    const d = {
      macId: machineId,
    };
    try {
      const { data } = await axios.post(
        "https://beta.imageproof.ai/api/check-key-activation",
        d
      );
      console.log(data);
      mac.info()
      if (data.success) {
        log.info(`${data.msg}`)
        navigate("/login", { state: data.findedKey.macId });
      }
    } catch (error) {
      log.warn(`${error}`)
      return console.log(error);
    }
  };

  return (
    <div className="App">
      <h5>Enter Your License Key </h5>
      <form onSubmit={lisenseSubmit}>
        <OtpInput
          value={code}
          onChange={handleChange}
          numInputs={16}
          separator={<span style={{ width: "8px" }}></span>}
          isInputNum={true}
          shouldAutoFocus={true}
          inputStyle={{
            border: "1px solid transparent",
            borderRadius: "8px",
            width: "54px",
            height: "54px",
            fontSize: "18px",
            color: "#000",
            fontWeight: "400",
            caretColor: "blue",
          }}
          focusStyle={{
            border: "1px solid #CFD3DB",
            outline: "none",
          }}
        />
        {error && <p className="text-danger">Please fill the all Digits</p>}
        <button className="licensekeyBtn">Submit</button>
      </form>
    </div>
  );
};

export default LicenseKey;
