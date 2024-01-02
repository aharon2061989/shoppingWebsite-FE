import React, {useRef, useState, useEffect} from "react";
import { createNewUser } from "../../services/api";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./Register.module.css";
import {Link} from "react-router-dom";


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,24}$/


function Register(){
    
    const userRef = useRef();
    const passwordRef = useRef();
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");    

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit  = async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }

        try {
            const newUserBody = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                city: city,
                country: country,
                address: address,  
                username: user,
                password: pwd
            };
            console.log("newUserBody:", newUserBody);
            const response = await createNewUser(newUserBody);
            setSuccess(true);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhoneNumber('');
            setCity('');
            setCountry('');
            setAddress('');
            setUser('');
            setPwd('');
            setMatchPwd('');

        } catch (err) {
            if (!err.response) {
                setErrMsg("No Server Response");
            }
            else if (err.response.status === 400) {
                setErrMsg("Username Taken");
            }
            else {
                setErrMsg("Registration Failed");
            }
            passwordRef.current.focus();
        }
    }

    return (

        <div>
            {success ? (
                <section>
                    <p className="success-msg">Registration successful! Please <Link to="/login">sign in</Link>.</p>
                </section>
            ) : (
            <div>
            <section>
                <p ref={passwordRef} className={errMsg ? classes.errmsg : classes.offscreen}>{errMsg}</p>
                <h1>Register</h1>

                <form onSubmit={handleSubmit}>
                    <label>First Name:</label>
                    <input
                        type="text"
                        id="First Name"
                        ref={userRef}
                        autoComplete="off"
                        onChange={ (e) => setFirstName(e.target.value)}
                        value={firstName}
                        required
                    />
                    <label>Last Name:</label>
                    <input
                        type="text"
                        id="Last Name"
                        autoComplete="off"
                        onChange={ (e) => setLastName(e.target.value)}
                        value={lastName}
                        required
                    />
                    <label>Email:</label>
                    <input
                        type="text"
                        id="Email"
                        autoComplete="off"
                        onChange={ (e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Phone Number:</label>
                    <input 
                        type="text"
                        id="Phone Number"
                        autoComplete="off"
                        onChange={ (e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    <label>Country:</label>
                    <input 
                    type="text"
                    id="country"
                    autoComplete="on"
                    onChange={ (e) => setCountry(e.target.value)}
                    required
                    />
                    <label>City:</label>
                    <input 
                    type="text"
                    id="city"
                    autoComplete="on"
                    onChange={ (e) => setCity(e.target.value)}
                    required
                    />
                    <label>Address:</label>
                    <input
                        type="text"
                        id="Address"
                        autoComplete="off"
                        onChange={ (e) => setAddress(e.target.value)}
                        required
                    />
                    <label htmlFor="username">
                        Username:
                        <FontAwesomeIcon icon={faCheck} className={validName ? classes.valid : classes.hide} />
                        <FontAwesomeIcon icon={faTimes} className={validName || !user ? classes.hide : classes.invalid} />
                    </label>
                    
                    <input
                        type="text"
                        id="username"
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                    />

                    <p id="uidnote" className={userFocus && !user && validMatch ? classes.instructions : classes.offscreen}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 24 characters.<br />
                        Must begin with a letter.<br />
                        Letters, numbers, underscores, hyphens allowed.
                    </p>

                    <label htmlFor="password">
                        Password:
                        <FontAwesomeIcon icon={faCheck} className={validPwd ? classes.valid : classes.hide} />
                        <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? classes.hide : classes.invalid} />
                    </label>
                    
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    />

                    <p id="pwdnote" className={pwdFocus && !validPwd ? classes.instructions : classes.offscreen}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters: <span>!</span> <span aria-label="at symbol">@</span> <span>#</span> <span>$</span> <span>%</span>
                    </p>

                    <label htmlFor="confirm_pwd">
                        Confirm Password:
                        <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? classes.valid : classes.hide} />
                        <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? classes.hide : classes.invalid} />
                    </label>

                    <input
                        type="password"
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        required
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                    />

                    <p id="confirmnote" className={matchFocus && !validMatch ? classes.instructions : classes.offscreen}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                    </p>

                    <button disabled={!validName || !validPwd || !validMatch ? true : false}>Register</button>
                </form>

                <p>
                    Already registered?<br />
                    <span className={classes.line}>
                    {/*put router link here*/}
                        <Link to={"/login"}>Sign In</Link>
                    </span>
                </p>
            </section>
        </div>
        )}
    </div>
    );
}
export default Register;