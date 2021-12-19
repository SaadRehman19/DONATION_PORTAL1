const express = require('express');

const app = express();
const connection = require('./database');
const path = require('path');
const { connect } = require('tls');



//set the path
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory))
app.use(express.static(path.join(__dirname, './Images')));
// console.log(__dirname);
//set view engine
app.set('view engine', 'hbs');


app.listen(4000, () => {
    console.log("app listening on port 4000");
    connection.connect(function (err) {
        if (err) throw err
        else {
            console.log("database connected");
        }
    })
});


//routing 
app.get('/', function (req, res) {
    res.render("index");
})

app.get('/login', function (req, res) {
    res.render("login");
})

app.get('/signup', (req, res) => {
    res.render("signup");
})



//contrubuters page
app.get('/donor_patient', function (req, res) {
    res.render("donor_patient");
})



// DONOR
app.get('/donorBlood', function (req, res) {
    res.render("donorBlood");
})

app.get('/donor_blood_submit', function (req, res) {
    //fetching data from form

    let d_id;
    const { name, cnic, email, bloodtype, age, contact, city, state, zip } = req.query;

    let qry = 'select donor_id from donor where cnic=?'
    connection.query(qry, [cnic], function (err, results) {
        if (err)
            throw err;
        if (results.length > 0) {
            /*d_id=`${results[0].donor_id}`;
            let qry3 = 'insert into blood_donor values(?,?)'
            connection.query(qry3, [d_id,bloodtype],function(err,results3){
                if(err)
                throw err;
                if(results3.affectedRows>0)
                res.send("donor half inserted");
            })*/
        } else {
            // console.log("donot not found");
            let qry1 = 'insert into donor (donor_name,cnic,email,age,contact_no,state,city,zipcode) values(?,?,?,?,?,?,?,?);'
            connection.query(qry1, [name, cnic, email, age, contact, state, city, zip], function (err, results1) {
                if (err)
                    throw err
                if (results1.affectedRows > 0) {

                    let qr2 = 'select donor_id from donor where cnic=?'
                    connection.query(qr2, [cnic], function (err, results2) {
                        if (err)
                            throw err;
                        if (results2.length > 0) {
                            d_id = `${results2[0].donor_id}`;
                            let qry3 = 'insert into blood_donor values(?,?)'
                            connection.query(qry3, [d_id, bloodtype], function (err, results3) {
                                if (err)
                                    throw err;
                                if (results3.affectedRows > 0) {



                                    let disp = 'select p.patient_id,p.patient_name,p1.blood_type,p.disease,p.age,p.contact_no,p.email,h.hosp_name,h.state,h.city,h.zipcode from blood_patient p1 inner join patient p on p1.patient_id=p.patient_id inner join hospital h on p1.hosp_id=h.hosp_id where p1.blood_type=? and h.city=?'
                                    connection.query(disp, [bloodtype, city], function (err, patdetails) {
                                        if (err)
                                            throw err;
                                        // if (patdetails.length > 0) {
                                        let dn = 'select d.donor_id,d.donor_name,d1.blood_type,d.contact_no,d.city,d.zipcode from donor d inner join blood_donor d1 on d.donor_id=d1.donor_id where d.cnic=?'
                                        connection.query(dn, [cnic], function (err, donordetails) {
                                            if (err)
                                                throw err
                                            var d_id = `${donordetails[0].donor_id}`
                                            var d_name=`${donordetails[0].donor_name}`
                                            res.render("donorBloodDetails", { p_list: patdetails, d_details: donordetails })

                                            //proceed......donor gives blood to patient
                                            app.get('/proceedbloodpatient/:patient_id/:patient_name', function (req, res) {
                                                let p_id = req.params.patient_id;
                                                let p_name=req.params.patient_name;
                                                var dt= new Date()


                                                let q1 = 'insert into patient_donor_blood (patient_name,donor_name,blood_type,date) values(?,?,?,?)'
                                                connection.query(q1, [p_name, d_name,bloodtype,dt], function (err, pd) {
                                                    if (err)
                                                        err
                                                    if (pd.affectedRows > 0) {
                                                        let q2 = 'delete from donor where donor_id=?'
                                                        connection.query(q2, [d_id], function (err, del_d) {
                                                            if (err)
                                                                throw err
                                                            let q3 = 'delete from patient where patient_id=?'
                                                            connection.query(q3, [p_id], function (err, del_p) {
                                                                if (err)
                                                                    throw err;
                                                                if (del_d.affectedRows > 0 && del_p.affectedRows > 0) {
                                                                    res.send("done");
                                                                }
                                                            })
                                                        })
                                                    }
                                                })

                                            })

                                        })
                                        // res.send(`${patdetails[0].blood_type}`);
                                        //}

                                    })
                                }
                            })
                        }

                    })

                }
            })
        }
    })

})




app.get('/donorMedicine', function (req, res) {
    res.render("donorMedicine");
})
app.get('/donor_medicine_submit', function (req, res) {

    const { name, cnic, contact, email, age, city, state, zipcode, medicineid, medicinename, quantity, mfg, exp } = req.query;

    let qry = 'select donor_id from donor where cnic=?'
    connection.query(qry, [cnic], function (err, results) {
        if (err)
            throw err;
        if (results.length > 0) {
            /*d_id=`${results[0].donor_id}`;
            let qry3 = 'insert into blood_donor values(?,?)'
            connection.query(qry3, [d_id,bloodtype],function(err,results3){
                if(err)
                throw err;
                if(results3.affectedRows>0)
                res.send("donor half inserted");
            })*/
        } else {
            let qry1 = 'insert into donor (donor_name,cnic,email,age,contact_no,state,city,zipcode) values(?,?,?,?,?,?,?,?);'
            connection.query(qry1, [name, cnic, email, age, contact, state, city, zipcode], function (err, results1) {
                if (err)
                    throw err
                if (results1.affectedRows > 0) {
                    let mqry = 'select medicine_id from medicine where medicine_id=?'
                    connection.query(mqry, [medicineid], function (err, results4) {
                        if (err)
                            throw err;
                        if (results4.length > 0) {
                            m_id = `${results4[0].medicine_id}`
                        } else {
                            let mqry1 = 'insert into medicine values(?,?)';
                            connection.query(mqry1, [medicineid, medicinename], function (err, results5) {
                                if (results5.affectedRows > 0) {
                                    m_id = `${medicineid}`
                                }
                            })
                        }
                        //add donor
                        let qr2 = 'select donor_id from donor where cnic=?'
                        connection.query(qr2, [cnic], function (err, results2) {
                            if (err)
                                throw err;
                            if (results2.length > 0) {

                                d_id = `${results2[0].donor_id}`;
                                let qry3 = 'insert into medicine_donor values(?,?,?,?,?)'
                                connection.query(qry3, [d_id, m_id, quantity, mfg, exp], function (err, results3) {
                                    if (err)
                                        throw err;
                                    if (results3.affectedRows > 0) {
                                        let disp = 'select p.patient_id,p.patient_name,p.email, p.contact_no,p.age, p.disease,m.medicine_name,p1.patient_city,p1.patient_zip from medicine_patient p1 inner join patient p on p1.patient_id=p.patient_id inner join medicine m on m.medicine_id=p1.medicine_id where p1.medicine_id=? and p1.patient_city=?'
                                        connection.query(disp, [medicineid, city], function (err, patdetails) {
                                            if (err)
                                                throw err;
                                            let dn = 'select d.donor_id,d.donor_name,m.medicine_name,d1.quantity,d.contact_no,d.city,d.zipcode from donor d inner join medicine_donor d1 on d.donor_id=d1.donor_id inner join medicine m on d1.medicine_id=m.medicine_id where d.cnic=?'
                                            connection.query(dn, [cnic], function (err, donordetails) {
                                                if (err)
                                                    throw err
                                                    var d_id = `${donordetails[0].donor_id}`
                                                    var d_name = `${donordetails[0].donor_name}`
                                                    var m_name=`${donordetails[0].medicine_name}`
                                                    var m_quantity=`${donordetails[0].quantity}`
                                                res.render("donorMedicineDetails", { p_list: patdetails, d_details: donordetails })

                                                //proceed......donor gives medicine to patient
                                            app.get('/proceedmedicinepatient/:patient_id/:patient_name', function (req, res) {
                                                let p_id = req.params.patient_id;
                                                let p_name=req.params.patient_name;
                                                var dt= new Date()


                                                let q1 = 'insert into patient_donor_medicine (patient_name,donor_name,medicine_name,quantity,date) values(?,?,?,?,?)'
                                                connection.query(q1, [p_name, d_name,m_name,m_quantity, dt], function (err, pd) {
                                                    if (err)
                                                        err
                                                    if (pd.affectedRows > 0) {
                                                        let q2 = 'delete from donor where donor_id=?'
                                                        connection.query(q2, [d_id], function (err, del_d) {
                                                            if (err)
                                                                throw err
                                                            let q3 = 'delete from patient where patient_id=?'
                                                            connection.query(q3, [p_id], function (err, del_p) {
                                                                if (err)
                                                                    throw err;
                                                                if (del_d.affectedRows > 0 && del_p.affectedRows > 0) {
                                                                    res.send("done");
                                                                }
                                                            })
                                                        })
                                                    }
                                                })

                                            })
                                              


                                            })
                                            // res.render("/", { p_list: patdetails, name: name,medicinename:medicinename, contact: contact, city: city})
                                            // res.send(patdetails);

                                        })
                                    }

                                })
                            }

                        })



                    })
                }
            })
        }
    })

})





// PATIENT
app.get('/PatientBlood', function (req, res) {
    res.render("PatientBlood");
})


app.get('/patient_blood_submit', function (req, res) {

    let h_id, p_id;
    //fetching data from form
    const { name, cnic, bloodtype, disease, email, age, contact, hospital, city, state, zipcode } = req.query;

    let qry = 'select patient_id from patient where cnic=?'
    connection.query(qry, [cnic], function (err, results) {
        if (err)
            throw err;
        if (results.length > 0) {
            /*d_id=`${results[0].donor_id}`;
            let qry3 = 'insert into blood_donor values(?,?)'
            connection.query(qry3, [d_id,bloodtype],function(err,results3){
                if(err)
                throw err;
                if(results3.affectedRows>0)
                res.send("donor half inserted");
            })*/
        } else {
            let qry1 = 'insert into patient (patient_name,cnic,disease,email,age,contact_no) values(?,?,?,?,?,?);'
            connection.query(qry1, [name, cnic, disease, email, age, contact, state, city, zipcode], function (err, results1) {
                if (err)
                    throw err
                if (results1.affectedRows > 0) {
                    let qry2 = 'select patient_id from patient where cnic=?'
                    connection.query(qry2, [cnic], function (err, results2) {
                        if (err)
                            throw err;
                        if (results2.length > 0) {
                            p_id = `${results2[0].patient_id}`;
                            let qry3 = 'insert into hospital (hosp_name,city,state,zipcode) values(?,?,?,?)'
                            connection.query(qry3, [hospital, city, state, zipcode], function (err, results3) {
                                if (err)
                                    throw err;
                                if (results3.affectedRows > 0) {
                                    let qry4 = 'select hosp_id from hospital where hosp_name=? and city=? and state=? and zipcode=?'
                                    connection.query(qry4, [hospital, city, state, zipcode], function (err, results4) {
                                        if (err)
                                            throw err;
                                        if (results4.length > 0) {
                                            // res.send(`${results4[0].hosp_id}`)
                                            h_id = `${results4[0].hosp_id}`;
                                            // console.log(h_id);
                                        }
                                        let qry5 = 'insert into blood_patient values(?,?,?)'
                                        connection.query(qry5, [p_id, bloodtype, h_id], function (err, results5) {
                                            if (err)
                                                throw err;
                                            if (results5.affectedRows > 0) {
                                                let disp = 'select d.donor_id,d.donor_name,d.email,d.contact_no,d.age,d1.blood_type,d.city,d.zipcode from donor d inner join blood_donor d1 on d.donor_id=d1.donor_id where d1.blood_type=? and d.city=?'
                                                connection.query(disp, [bloodtype, city], function (err, donordetails) {
                                                    if (err)
                                                        throw err;

                                                    let pt = 'select p.patient_id,p.patient_name,p.email,p1.blood_type,p.disease,p.contact_no,h.hosp_name,h.state,h.city,h.zipcode from blood_patient p1 inner join patient p on p1.patient_id=p.patient_id inner join hospital h on p1.hosp_id=h.hosp_id where p.cnic=? ';
                                                    connection.query(pt, [cnic], function (err, patientdetail) {
                                                        var p_id = `${patientdetail[0].patient_id}`
                                                        var p_name= `${patientdetail[0].patient_name}`
                                                        if (err)
                                                            throw err;
                                                        res.render("patientBloodDetails", { d_list: donordetails, p_detail: patientdetail })

                                                        //proceed...... patient recieve blood from donor
                                            app.get('/proceedblooddonor/:donor_id/:donor_name', function (req, res) {
                                                let d_id = req.params.donor_id;
                                                let d_name=req.params.donor_name;
                                                var dt= new Date()


                                                let q1 = 'insert into patient_donor_blood (patient_name,donor_name,blood_type,date) values(?,?,?,?)'
                                                connection.query(q1, [p_name, d_name,bloodtype,dt], function (err, pd) {
                                                    if (err)
                                                        err
                                                    if (pd.affectedRows > 0) {
                                                        let q2 = 'delete from donor where donor_id=?'
                                                        connection.query(q2, [d_id], function (err, del_d) {
                                                            if (err)
                                                                throw err
                                                            let q3 = 'delete from patient where patient_id=?'
                                                            connection.query(q3, [p_id], function (err, del_p) {
                                                                if (err)
                                                                    throw err;
                                                                if (del_d.affectedRows > 0 && del_p.affectedRows > 0) {
                                                                    res.send("done");
                                                                }
                                                            })
                                                        })
                                                    }
                                                })

                                            })

                                                    })

                                                })
                                            }
                                        })

                                    })





                                }
                            })


                        }

                    })

                }
            })
        }
    })

})


app.get('/patient_medicine_submit', function (req, res) {

    let m_id, p_id;
    const { name, cnic, disease, email, contact, age, medicineid, medicinename, state, city, zipcode } = req.query;

    let qry = 'select patient_id from patient where cnic=?'
    connection.query(qry, [cnic], function (err, results) {
        if (err)
            throw err;
        if (results.length > 0) {
            /*d_id=`${results[0].donor_id}`;
            let qry3 = 'insert into blood_donor values(?,?)'
            connection.query(qry3, [d_id,bloodtype],function(err,results3){
                if(err)
                throw err;
                if(results3.affectedRows>0)
                res.send("donor half inserted");
            })*/
        } else {
            let qry1 = 'insert into patient (patient_name,cnic,disease,email,age,contact_no) values(?,?,?,?,?,?);'
            connection.query(qry1, [name, cnic, disease, email, age, contact], function (err, results1) {
                if (err)
                    throw err
                if (results1.affectedRows > 0) {
                    let mqry = 'select medicine_id from medicine where medicine_id=?'
                    connection.query(mqry, [medicineid], function (err, results4) {
                        if (err)
                            throw err;
                        if (results4.length > 0) {
                            m_id = `${results4[0].medicine_id}`
                        } else {
                            let mqry1 = 'insert into medicine values(?,?)';
                            connection.query(mqry1, [medicineid, medicinename], function (err, results5) {
                                if (results5.affectedRows > 0) {
                                    m_id = `${medicineid}`
                                }
                            })
                        }
                        //add patient
                        let qr2 = 'select patient_id from patient where cnic=?'
                        connection.query(qr2, [cnic], function (err, results2) {
                            if (err)
                                throw err;
                            if (results2.length > 0) {

                                p_id = `${results2[0].patient_id}`;
                                let qry3 = 'insert into medicine_patient values(?,?,?,?,?)'
                                connection.query(qry3, [p_id, m_id, state, city, zipcode], function (err, results3) {
                                    if (err)
                                        throw err;
                                    if (results3.affectedRows > 0) {
                                        let disp = 'select d.donor_id,d.donor_name,d.email,d.contact_no,m.medicine_name,d1.quantity,d1.mfg,d1.exp,d.state,d.city,d.zipcode from donor d inner join medicine_donor d1 on d.donor_id=d1.donor_id inner join medicine m on m.medicine_id=d1.medicine_id where d1.medicine_id=? and d.city=?'
                                        connection.query(disp, [medicineid, city], function (err, donordetails) {
                                            if (err)
                                                throw err;

                                            let pt = 'select p.patient_id,p.patient_id,p.patient_name,p.email, p.contact_no,p.disease,m.medicine_name,p1.patient_city,p1.patient_zip from medicine_patient p1 inner join patient p on p1.patient_id=p.patient_id inner join medicine m on m.medicine_id=p1.medicine_id where p.cnic=?'
                                            connection.query(pt, [cnic], function (err, patientdetail) {
                                                var p_id = `${patientdetail[0].patient_id}`
                                                var p_name= `${patientdetail[0].patient_name}`
                                                var m_name= `${patientdetail[0].medicine_name}`
                                                res.render("patientMedicineDetails", { d_list: donordetails, p_detail: patientdetail })

                                                  //proceed...... patient revieve medicine from donor
                                            app.get('/proceedmedicinedonor/:donor_id/:donor_name/:quantity', function (req, res) {
                                                let d_id = req.params.donor_id;
                                                let d_name=req.params.donor_name;
                                                let m_quantity=req.params.quantity;
                                                var dt= new Date()


                                                let q1 = 'insert into patient_donor_medicine (patient_name,donor_name,medicine_name,quantity,date) values(?,?,?,?,?)'
                                                connection.query(q1, [p_name, d_name,m_name,m_quantity, dt], function (err, pd) {
                                                    if (err)
                                                        err
                                                    if (pd.affectedRows > 0) {
                                                        let q2 = 'delete from donor where donor_id=?'
                                                        connection.query(q2, [d_id], function (err, del_d) {
                                                            if (err)
                                                                throw err
                                                            let q3 = 'delete from patient where patient_id=?'
                                                            connection.query(q3, [p_id], function (err, del_p) {
                                                                if (err)
                                                                    throw err;
                                                                if (del_d.affectedRows > 0 && del_p.affectedRows > 0) {
                                                                    res.send("done");
                                                                }
                                                            })
                                                        })
                                                    }
                                                })

                                            })
                                            })
                                            // res.send(donordetails);
                                        })
                                    }

                                })
                            }

                        })



                    })
                }
            })
        }
    })

})



app.get('/PatientMedicine', function (req, res) {
    res.render("PatientMedicine");
})


//login signup
app.get('/signupuser', (req, res) => {

    //fetching data from form
    const { user_name, password } = req.query;

    //search from table
    let qry = "select * from user where username=?"
    connection.query(qry, [user_name], function (err, results) {
        if (err)
            throw err;
        else {
            if (results.length > 0) {
                res.render("signup", { signupmsg: true });
            } else {
                //inset into table
                let qry = 'insert into user (username,password) values(?,?)'
                connection.query(qry, [user_name, password], function (err, results) {
                    if (err)
                        throw err
                    if (results.affectedRows > 0) {
                        res.render("login");
                    }
                });
            }
        }

    })
})


app.get('/loginuser', (req, res) => {
    const { user_name, password } = req.query;
    let qry = 'select * from user where username=? and password=?'
    connection.query(qry, [user_name, password], function (err, results) {
        if (err)
            throw err;
        else {
            if (results.length > 0) {
                let q1='select * from patient_donor_blood'
                connection.query(q1,function(err,results1){
                    let q2='select * from patient_donor_medicine'
                    connection.query(q2,function(err,results2){

                        res.render("donor_patient",{blood_contributers:results1,medicine_contributers:results2})
                    })
                })
            } else {
                res.render("login", { loginmsg: true });
            }
        }
    })
})



// updaing blood donor
app.get('/UpdateBloodDonor/:donor_id', function (req, res) {
    var d_id = req.params.donor_id;
    let q1 = 'select d.*,d1.* from donor d inner join blood_donor d1 on d.donor_id=d1.donor_id where d.donor_id=?'
    connection.query(q1, [d_id], function (err, results) {
        if (err)
            throw err;
        // res.send(results);
        res.render('FormUpdateBloodDonor', { d_data: results });
    })
    // res.send(d_id);
})

app.get('/donor_blood_update/:donor_id', function (req, res) {

    var d_id = req.params.donor_id;
    const { name, cnic, email, bloodtype, age, contact, city, state, zip } = req.query;
    let q1 = 'update donor set donor_name=?,cnic=? ,email=?, age=? ,contact_no=?, state=?, city=?, zipcode=? where donor_id=?'
    connection.query(q1, [name, cnic, email, age, contact, city, state, zip, d_id], function (err, results) {
        let q2 = 'update blood_donor set blood_type=? where donor_id=?';
        connection.query(q2, [bloodtype, d_id], function (err, results1) {
            // if(results.affectedRows>0 && results1.affectedRows>0)
            // {
            //     // res.send("updated");
            // }

            let disp = 'select p.patient_id,p.patient_name,p1.blood_type,p.disease,p.age,p.contact_no,p.email,h.hosp_name,h.state,h.city,h.zipcode from blood_patient p1 inner join patient p on p1.patient_id=p.patient_id inner join hospital h on p1.hosp_id=h.hosp_id where p1.blood_type=? and h.city=?'
            connection.query(disp, [bloodtype, city], function (err, patdetails) {
                if (err)
                    throw err;
                // if (patdetails.length > 0) {
                let dn = 'select d.donor_id,d.donor_name,d1.blood_type,d.contact_no,d.city,d.zipcode from donor d inner join blood_donor d1 on d.donor_id=d1.donor_id where d.cnic=?'
                connection.query(dn, [cnic], function (err, donordetails) {
                    if (err)
                        throw err
                    res.render("donorBloodDetails", { p_list: patdetails, d_details: donordetails })

                })
                // res.send(`${patdetails[0].blood_type}`);
                //}

            })

        })

    })
})





//update medicine donor
app.get('/UpdateMedicineDonor/:donor_id', function (req, res) {
    var d_id = req.params.donor_id;
    let q1 = 'select d.*,m.*,d1.* from donor d inner join medicine_donor d1 on d.donor_id=d1.donor_id inner join medicine m on m.medicine_id=d1.medicine_id where d.donor_id=?'
    connection.query(q1, [d_id], function (err, results) {
        if (err)
            throw err;
        // res.send(results);
        res.render('FormUpdateMedicineDonor', { d_data: results });
    })
})

app.get('/donor_medicine_update/:donor_id', function (req, res) {

    var d_id = req.params.donor_id;
    const { name, cnic, contact, email, age, city, state, zipcode, medicineid, medicinename, quantity, mfg, exp } = req.query;
    let q1 = 'update donor set donor_name=?,cnic=? ,email=?, age=? ,contact_no=?, state=?, city=?, zipcode=? where donor_id=?'
    connection.query(q1, [name, cnic, email, age, contact, city, state, zipcode, d_id], function (err, results) {
        let q2 = 'update medicine set medicine_name=? where medicine_id=?';
        connection.query(q2, [medicinename, medicineid], function (err, results1) {
            let q3 = 'update medicine_donor set medicine_id=?,quantity=?,mfg=?,exp=? where donor_id=?'
            connection.query(q3, [medicineid, quantity, mfg, exp, d_id], function (err, results2) {

                // res.send("updated");

                let disp = 'select p.patient_id,p.patient_name,p.email, p.contact_no,p.age, p.disease,m.medicine_name,p1.patient_city,p1.patient_zip from medicine_patient p1 inner join patient p on p1.patient_id=p.patient_id inner join medicine m on m.medicine_id=p1.medicine_id where p1.medicine_id=? and p1.patient_city=?'
                connection.query(disp, [medicineid, city], function (err, patdetails) {
                    if (err)
                        throw err;
                    let dn = 'select d.donor_id,d.donor_name,m.medicine_name,d1.quantity,d.contact_no,d.city,d.zipcode from donor d inner join medicine_donor d1 on d.donor_id=d1.donor_id inner join medicine m on d1.medicine_id=m.medicine_id where d.cnic=?'
                    connection.query(dn, [cnic], function (err, donordetails) {
                        if (err)
                            throw err

                        res.render("donorMedicineDetails", { p_list: patdetails, d_details: donordetails })

                    })
                    // res.render("/", { p_list: patdetails, name: name,medicinename:medicinename, contact: contact, city: city})
                    // res.send(patdetails);

                })
            })

        })

    })
})





// update blood patient
app.get('/UpdateBloodPatient/:patient_id', function (req, res) {
    let p_id = req.params.patient_id;
    let q1 = 'select p.*,p1.*,h.* from blood_patient p1 inner join patient p on p1.patient_id=p.patient_id inner join hospital h on p1.hosp_id=h.hosp_id where p.patient_id=? '
    connection.query(q1, [p_id], function (err, results) {
        if (err)
            throw err;
        res.render('FormUpdateBloodPatient', { p_data: results });
    })
})
app.get('/patient_blood_update/:patient_id/:hosp_id', function (req, res) {

    var p_id = req.params.patient_id;
    var h_id = req.params.hosp_id;
    const { name, cnic, bloodtype, disease, email, age, contact, hospital, city, state, zipcode } = req.query;
    let q1 = 'update patient set patient_name=?,cnic=?,disease=? ,email=?, age=? ,contact_no=? where patient_id=?'
    connection.query(q1, [name, cnic, email, age, contact, city, state, zipcode, p_id], function (err, results) {
        let q2 = 'update hospital set hosp_name=? where hosp_id=?';
        connection.query(q2, [hospital, h_id], function (err, results1) {
            let q3 = 'update blood_patient set blood_type=?,hosp_id=? where patient_id=?'
            connection.query(q3, [bloodtype, h_id, p_id], function (err, results2) {
                if (err)
                    throw err
                // res.send("updated");
                let disp = 'select d.donor_id,d.donor_name,d.email,d.contact_no,d.age,d1.blood_type,d.city,d.zipcode from donor d inner join blood_donor d1 on d.donor_id=d1.donor_id where d1.blood_type=? and d.city=?'
                connection.query(disp, [bloodtype, city], function (err, donordetails) {
                    if (err)
                        throw err;

                    let pt = 'select p.patient_id,p.patient_name,p.email,p1.blood_type,p.disease,p.contact_no,h.hosp_name,h.state,h.city,h.zipcode from blood_patient p1 inner join patient p on p1.patient_id=p.patient_id inner join hospital h on p1.hosp_id=h.hosp_id where p.cnic=? ';
                    connection.query(pt, [cnic], function (err, patientdetail) {
                        if (err)
                            throw err;
                        res.render("patientBloodDetails", { d_list: donordetails, p_detail: patientdetail })

                    })
                    // res.send(donordetails);

                })
            })
        })

    })
})



//update medicine patient

app.get('/UpdateMedicinePatient/:patient_id', function (req, res) {
    let p_id = req.params.patient_id;
    let q1 = 'select p.*,p1.*,m.* from medicine_patient p1 inner join patient p on p1.patient_id=p.patient_id inner join medicine m on p1.medicine_id=m.medicine_id where p.patient_id=? '
    connection.query(q1, [p_id], function (err, results) {
        if (err)
            throw err;
        // res.send("done")
        res.render('FormUpdateMedicinePatient', { p_data: results });
    })

})

app.get('/patient_medicine_update/:patient_id', function (req, res) {

    var p_id = req.params.patient_id;
    const { name, cnic, disease, email, contact, age, medicineid, medicinename, state, city, zipcode } = req.query;
    let q1 = 'update patient set patient_name=?,cnic=?,disease=? ,email=?, age=? ,contact_no=? where patient_id=?'
    connection.query(q1, [name, cnic, disease, email, age, contact, p_id], function (err, results) {
        let q2 = 'update medicine set medicine_name=? where medicine_id=?';
        connection.query(q2, [medicinename, medicineid], function (err, results1) {
            let q3 = 'update medicine_patient set medicine_id=?,patient_state=?,patient_city=?,patient_zip=? where patient_id=?'
            connection.query(q3, [medicineid, state, city, zipcode, p_id], function (err, results2) {
                // res.send("updated");
                let disp = 'select d.donor_id,d.donor_name,d.email,d.contact_no,m.medicine_name,d1.quantity,d1.mfg,d1.exp,d.state,d.city,d.zipcode from donor d inner join medicine_donor d1 on d.donor_id=d1.donor_id inner join medicine m on m.medicine_id=d1.medicine_id where d1.medicine_id=? and d.city=?'
                connection.query(disp, [medicineid, city], function (err, donordetails) {
                    if (err)
                        throw err;

                    let pt = 'select p.patient_id,p.patient_id,p.patient_name,p.email, p.contact_no,p.disease,m.medicine_name,p1.patient_city,p1.patient_zip from medicine_patient p1 inner join patient p on p1.patient_id=p.patient_id inner join medicine m on m.medicine_id=p1.medicine_id where p.cnic=?'
                    connection.query(pt, [cnic], function (err, patientdetail) {

                        res.render("patientMedicineDetails", { d_list: donordetails, p_detail: patientdetail })
                    })
                    // res.send(donordetails);
                })
            })

        })


    })
})


// DELETE Blood DONOR
app.get('/DeleteBloodDonor/:donor_id', function (req, res) {
    var d_id = req.params.donor_id;
    let q1 = 'delete from donor where donor_id=?'
    connection.query(q1, [d_id], function (err, results) {
        if (err)
            throw err;
        if (results.affectedRows > 0) {
            //  app.get('/DeleteBloodDonor/:donor_id/donor_patient',function(req,res){
            res.render("donor_patient");

            //})
        }
    })
})


//DELETE MEDICINE DONOR
app.get('/DeleteMedicineDonor/:donor_id', function (req, res) {
    var d_id = req.params.donor_id;
    let q1 = 'delete from donor where donor_id=?'
    connection.query(q1, [d_id], function (err, results) {
        if (err)
            throw err;
        if (results.affectedRows > 0) {
            res.render("donor_patient");
        }
    })
})




//DELETE BLOOD PATIENT
app.get('/DeleteBloodPatient/:patient_id', function (req, res) {
    let p_id = req.params.patient_id;
    let q1 = 'delete from patient where patient_id=? '
    connection.query(q1, [p_id], function (err, results) {
        if (err)
            throw err;
        if (results.affectedRows > 0) {
            res.render("donor_patient");
        }
    })
})



//DELETE MEDICINE PATIENT

app.get('/DeleteMedicinePatient/:patient_id', function (req, res) {
    let p_id = req.params.patient_id;
    let q1 = 'delete from patient where patient_id=?'
    connection.query(q1, [p_id], function (err, results) {
        if (err)
            throw err;
        if (results.affectedRows > 0) {
            res.render("donor_patient");
        }

    })

})


