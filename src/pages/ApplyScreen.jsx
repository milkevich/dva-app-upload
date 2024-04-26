import Button from '../shared/UI/Button';
import Input from '../shared/UI/Input'
import QContainer from '../shared/UI/QContainer';
import '../shared/styles/Variables.scss'
import Divider from '@mui/material/Divider';
import { v4 as uuid } from 'uuid';
import React, { useState } from 'react'
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { HiOutlineUpload } from "react-icons/hi";
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { HiBadgeCheck } from "react-icons/hi";
import logo from '../imgs/logoDVAlog.jpeg'


const ApplyScreen = () => {
  const [documentUploaded, setDocumentUploaded] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [experience, setExperience] = useState('');
  const [ssn, setSsn] = useState(false);
  const [workAuthorization, setWorkAuthorization] = useState(false);
  const [llcCompany, setLlcCompany] = useState(false);
  const [bankAccount, setBankAccount] = useState(false);
  const [medicalCertificate, setMedicalCertificate] = useState(false);
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [contact, setContact] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const labelStyles = {
    borderRadius: "var(--border-radius)",
    color: "var(--accent-color)",
    cursor: "pointer",
    border: "1px solid var(--main-bg-secondary-color)",
    padding: "8px 10px 8px 10px",
    position: "relative",
    top: "10px",
    textAlign: "center",
    height: "20px",
    backgroundColor: "var(--main-input-bg-color)",
  }
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      console.log(file.size);
      setLoading(true);
      alert('File size exceeds the maximum limit (5MB). Please choose a smaller file.');
    } else {
      console.log(file.size);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
      const storageRef = ref(storage, `images/${uuid()}`);
      const uploadImg = uploadBytesResumable(storageRef, file);

      uploadImg.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload error:', error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadImg.snapshot.ref);
            setDocumentUploaded(downloadURL);
            setLoading(false);
          } catch (error) {
            console.error('Error getting download URL:', error);
          }
        }
      );
    }
  };

  const submit = async (e) => {
    e.preventDefault();
      if (
      firstName === '' ||
      lastName === '' ||
      address === '' ||
      contact === ''
    ) {
      setSuccess(false);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setError(true);      
      return;
    }
  
    const applicantId = uuid();
    const applicantRef = doc(db, 'applicants', applicantId);
  
    try {
      await setDoc(applicantRef, {
        applicant: {
          id: applicantId,
          firstName: firstName,
          lastName: lastName,
          experience: experience,
          address: address,
          contact: contact,
          driverLicense: documentUploaded, 
        },
        ssn: ssn,
        workAuthorization: workAuthorization,
        llcCompany: llcCompany,
        bankAccount: bankAccount,
        medicalCertificate: medicalCertificate,
        startDate: startDate,
        time: Timestamp.now(),
      });
      setSuccess(true)
      setFirstName('');
      setLastName('');
      setExperience('');
      setSsn(false);
      setWorkAuthorization(false);
      setLlcCompany(false);
      setBankAccount(false);
      setMedicalCertificate(false);
      setAddress('');
      setStartDate('');
      setContact('');
      setFilePreview(null);
      setDocumentUploaded(null);
    } catch (error) {
      console.error('Error adding document:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };

  const handleInputValidation = (e) => {
    const value = e.target.value.replace(/\D/g, ''); 
    let formattedValue = value;

    if (value.length > 2 && value.length <= 4) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2)}`;
    } else if (value.length > 4) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    }

    setStartDate(formattedValue);

    const dateFormat = /^\d{2}\/\d{2}\/\d{2}$/;

    if (!dateFormat.test(formattedValue)) {
    } else {
    }
  };

  return (
    <div style={{ maxWidth: '100%', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
      {success ? 
      <div style={{height: "100vh", textAlign: "center", margin: "auto"}} >
        <div style={{marginTop: "250px"}}>
        <HiBadgeCheck color='#75ed2f' size={90}/>
        <h2 style={{ marginBottom: "10px"}}>Заявка Отправлена!</h2>
        <p style={{color: "var(--main-secondary-color)", marginTop: "0", maxWidth: "300px"}}>С вами свяжутся в течении 3-5 дней. Пожалуйста оставайтесь на связи.</p>
        </div>
        <div style={{ position: 'fixed', bottom: '0', backgroundColor: 'var(--main-bg-color)', width: '100%', borderTop: '1px solid var(--input-bg-color)', paddingBottom: 'env(safe-area-inset-bottom)', left: 0 }}>
            <QContainer noMargin>
              <Button onClick={() => {window.location.reload()}} width="334px">Назад</Button>
            </QContainer>
          </div>
      </div> :
        <>
          <div style={{ width: "320px", margin: "auto", zIndex: "1000000" }}>
            <Slide direction="down" in={error} mountOnEnter unmountOnExit>
              <Alert sx={{ marginTop: "10px", position: "fixed" }} severity="error">Заполните все обязательные строки.</Alert>
            </Slide>
          </div>
          <div style={{margin: "auto", maxWidth: "334px", marginTop: "20px", marginBottom: "10px",}}>
            <img style={{maxWidth: "150px"}} src={logo} alt="Dva Logistics Logo" />
          </div>
            <Divider />
          <>
            <QContainer>
              <h3 style={{ margin: 0, padding: 0 }}>Как вас зовут?<span style={{ color: "var(--danger-color)" }}>*</span></h3>
              <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>Пожалуйста введите своё имя.</p>
              <Input name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} def placeholder="Пр. Владислав" />
            </QContainer>
            <br />
            <Divider />
          </>
          <>
            <QContainer>
              <h3 style={{ margin: 0, padding: 0 }}>Какая у вас фамилия?<span style={{ color: "var(--danger-color)" }}>*</span></h3>
              <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>Пожалуйста введите свою фамилию.</p>
              <Input name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} def placeholder="Пр. Иванов" />
            </QContainer>
            <br />
            <Divider />
          </>
          <>
            <QContainer>
              <h3 style={{ margin: 0, padding: 0 }}>У вас есть опыт работы на пикап-траке?</h3>
              <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>Пожалуйста выберите один из вариантов.</p>
              <Input select value={experience} onChange={(e) => setExperience(e.target.value)} type="number" placeholder="Ex. 5" />
            </QContainer>
            <br />
            <Divider />
          </>
          <>
            <QContainer>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, padding: 0 }}>У вас есть SSN?</h3>
                  <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>(Social Security Number)</p>
                </div>
                <Input checkbox value={ssn} onClick={(e) => setSsn(true)} type="checkbox" />
              </div>
            </QContainer>
            <Divider style={{ marginTop: '10px' }} />
          </>
          <>
            <QContainer>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, padding: 0 }}>У вас есть work authorization?</h3>
                  <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>(Разрешение на работу в США)</p>
                </div>
                <Input checkbox value={workAuthorization} onClick={(e) => setWorkAuthorization(true)} type="checkbox" />
              </div>
            </QContainer>
            <Divider style={{ marginTop: '10px' }} />
          </>
          <>
            <QContainer>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, padding: 0 }}>У вас есть LLC Компания?</h3>
                  <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>(Limited Liability Company)</p>
                </div>
                <Input checkbox value={llcCompany} onClick={(e) => setLlcCompany(true)} type="checkbox" />
              </div>
            </QContainer>
            <Divider style={{ marginTop: '10px' }} />
          </>
          <>
            <QContainer>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, padding: 0 }}>У вас есть банковский аккаунт?</h3>
                  <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>(US valid debit card)</p>
                </div>
                <Input checkbox value={bankAccount} onClick={(e) => setBankAccount(true)} type="checkbox" />
              </div>
            </QContainer>
            <Divider style={{ marginTop: '10px' }} />
          </>
          <>
            <QContainer>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, padding: 0 }}>У вас есть водительская мед. справка?</h3>
                  <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>(Водительская Медицинская Справка)</p>
                </div>
                <Input checkbox value={medicalCertificate} onClick={(e) => setMedicalCertificate(true)} type="checkbox" />
              </div>
            </QContainer>
            <Divider style={{ marginTop: '10px' }} />
          </>
          <>
            <QContainer>
              <h3 style={{ margin: 0, padding: 0 }}>Загрузите водительские права</h3>
              <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>Загрузите фото своего водительского удостоверения.</p>
              <label style={labelStyles} htmlFor="file-upload">
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", position: "relative", bottom: "2px", fontWeight: "400" }}><HiOutlineUpload style={{ marginBottom: "0" }} /> Загрузить </div>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </label>
              <div style={{ width: "334px", height: "200px", backgroundColor: "red", marginTop: "30px", borderRadius: "var(--border-radius)", display: loading ? "block" : "none", position: "relative", zIndex: "1000" }}></div>
              {filePreview && <img src={filePreview} alt="Uploaded File" style={{ maxWidth: "100%", borderRadius: "var(--border-radius)", marginTop: "30px", position: "relative", display: !loading ? "block" : "none" }} />}

            </QContainer>
            <Divider style={{ marginTop: '30px' }} />
          </>
          <>
            <QContainer>
              <h3 style={{ margin: 0, padding: 0 }}>Укажите свой адесс проживания<span style={{ color: "var(--danger-color)" }}>*</span></h3>
              <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>Пожалуйста введите свой полный адесс проживания, включая штат и город.</p>
              <Input name="address" value={address} onChange={(e) => setAddress(e.target.value)} def placeholder="Введите свой адресс" />
            </QContainer>
            <Divider style={{ marginTop: '30px' }} />
          </>
          <>
            <QContainer>
              <h3 style={{ margin: 0, padding: 0 }}>Укажите дату с которой вы готовы начать работать</h3>
              <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>Пожалуйста введите время в MM/ДД/ГГ формате.</p>
              <Input maxLength={8} pattern="\d{2}/\d{2}/\d{2}"  value={startDate} onChange={handleInputValidation} def placeholder="Пр. MM/ДД/ГГ " />
            </QContainer>
            <Divider style={{ marginTop: '30px' }} />
          </>
          <>
            <QContainer>
              <h3 style={{ margin: 0, padding: 0 }}>Укажите контакт для связи с вами<span style={{ color: "var(--danger-color)" }}>*</span></h3>
              <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>Пожалуйста введите номер телефона/адресс электронной почты.</p>
              <Input value={contact} onChange={(e) => setContact(e.target.value)} def placeholder="Пр. +1 234 567 8910 " />
            </QContainer>
            <Divider style={{ marginTop: '30px' }} />
          </>
          <div style={{ position: 'sticky', bottom: '1px', backgroundColor: 'var(--main-bg-color)', width: '100%', borderTop: '1px solid var(--input-bg-color)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <QContainer noMargin>
              <Button onClick={submit} width="334px">Оставить Заявку</Button>
            </QContainer>
          </div>
        </>
      }
    </div>
  );

}

export default ApplyScreen;
