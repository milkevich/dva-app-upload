import React, { useEffect, useState } from 'react';
import QContainer from '../shared/UI/QContainer';
import { Divider, Slide } from '@mui/material';
import Filtered from '../shared/UI/Filtered';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import Loader from '../shared/UI/Loader';
import { HiOutlineChevronDown } from "react-icons/hi";
import { HiOutlineDownload } from "react-icons/hi";
import Button from '../shared/UI/Button';
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { HiArrowSmRight } from "react-icons/hi";

const ApplicantsProtected = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [openDelete, setOpenDelete] = useState(null);


  useEffect(() => {
    const getApplicants = async () => {
      setLoading(true);

      let applicantsRef = collection(db, "applicants");

      const unsub = onSnapshot(applicantsRef, (snapshot) => {
        const applicantsData = snapshot.docs.map(doc => {
          const applicantData = { id: doc.id, ...doc.data() };
          applicantData.relativeTime = formatRelativeTime(applicantData.time.toDate());

          return applicantData;
        });

        console.log(applicantsData)
        setApplicants(applicantsData);
        setLoading(false);
      });

      return () => unsub();
    };

    getApplicants();
  }, []);

  const formatRelativeTime = ((date) => {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years}г`;
    } else if (days > 0) {
      return `${days}д`;
    } else if (hours > 0) {
      return `${hours}ч`;
    } else if (minutes > 0) {
      return `${minutes}м`;
    } else if (seconds > 0) {
      return `${seconds}с`;
    } else {
      return "сейчас";
    }
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const deleteApplicant = async () => {
      await deleteDoc(doc(db, "applicants", expandedId))
      setOpenDelete(false);
  }

  return (
    <div style={{ maxWidth: '100%', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
      {loading ? <Loader /> :
        <>
          <div style={{ position: "sticky", top: 0, backgroundColor: "var(--main-bg-color)", borderBottom: "1px solid var(--input-bg-color)", margin: 0, padding: 0, height: "58px" }}>
            <QContainer noMargin>
              <h3 style={{ textAlign: "center", marginTop: "4px", display: "flex", alignItems: "start", marginLeft: "95px" }}>Все кандидаты <span style={{ fontSize: "12px", color: "var(--main-secondary-color)", marginLeft: "5px" }}> ({applicants.length})</span></h3>
            </QContainer>
          </div>

          {applicants.length === 0 && 
          <div style={{display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', height: '85vh', }}>
            <div style={{maxWidth: "250px", textAlign: "center", margin: "auto"}}>
            <HiOutlineSpeakerphone style={{fontSize: "64px"}}/>
            <h3>Кандидатов пока что нет, вернитесь позже</h3>
            </div>
          </div>
          }

          {applicants?.map((applicant) => (
            <>
            {openDelete &&
              <div style={{width: "100vw", height: "100vh", position: "fixed", justifyContent: "center", display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: "10000000", backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
                <Slide in={openDelete} direction='up'>
                <div style={{maxWidth: "295px", margin: "auto", backgroundColor: "var(--main-bg-color)", padding: "0px 20px 12px 20px", borderRadius: "var(--border-radius)"}}>
                  <p>Вы уверены что хотите удалить этого кандидата? Информация о нем будет удалена навсегда.</p>
                  <div style={{display: "flex", flexDirection: "column"}}>
                    <Button onClick={deleteApplicant}>Удалить</Button>
                    <Button onClick={() => setOpenDelete(false)} secondary>Отмена</Button>
                  </div>
                </div>
                </Slide>
              </div>
              }
            <div key={applicant.id}>
              <QContainer>
                <div style={{ display: "flex", alignItems: "start" }}>
                  <h3 style={{ margin: 0, padding: 0, flex: 1 }}>{applicant.applicant.firstName} {applicant.applicant.lastName}</h3>
                  <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>{applicant.relativeTime}</p>
                </div>
                <p style={{ marginTop: "-10px", padding: 0, color: 'var(--main-secondary-color)' }}>{applicant.applicant.experience === '' ? 'Без опыта' : applicant.applicant.experience}</p>
                <div style={{  }}>
                    <Filtered approved={applicant.ssn}>SSN</Filtered>
                    <Filtered approved={applicant.workAuthorization}>Разрешение на работу</Filtered>
                    <Filtered approved={applicant.bankAccount}>Банковский Аккаунт</Filtered>
                    <Filtered approved={applicant.llcCompany}>LLC</Filtered>
                    <Filtered approved={applicant.medicalCertificate}>Мед. Справка</Filtered>
                </div>
                {expandedId === applicant.id &&
                  <div>
                    {applicant.applicant.driverLicense !== null ? 
                    <div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <h3 style={{ flex: 1 }}>Водительские права: </h3>
                          <a style={{ color: "var(--main-color)" }} href={applicant.applicant.driverLicense} download={applicant.applicant.driverLicense}>
                            <HiOutlineDownload style={{ fontSize: "20px", backgroundColor: "var(--main-bg-color)", padding: "5px 6px 6px 6px", borderRadius: "var(--border-radius)", border: "1px solid var(--input-bg-color)" }} />
                          </a>
                      </div>
                      
                      <img style={{ maxWidth: "334px", borderRadius: "var(--border-radius)" }} src={applicant.applicant.driverLicense} alt="DriverLicense" />
                    </div>
                    : <></>
                      }
                      {applicant.startDate !== '' ? 
                    <div>
                      <h3 style={{ padding: 0, marginTop: "5px", marginBottom: "5px" }}>Дата начала работы:</h3>
                      <p style={{ color: "var(--main-secondary-color)", padding: 0, margin: 0, }}>{applicant.startDate}</p>
                    </div>
                    : <></>
                    }
                    <div>
                      <h3 style={{ padding: 0, marginTop: "5px", marginBottom: "5px" }}>Связаться:</h3>
                      <p style={{ color: "var(--main-secondary-color)", padding: 0, margin: 0, }}>{applicant.applicant.contact}</p>
                    </div>
                    <div style={{display: "flex", alignItems: "end"}}>
                      <div style={{flex: 1}}>
                      <h3 style={{ padding: 0, marginTop: "5px", marginBottom: "5px" }}>Адресс проживания:</h3>
                      <p style={{ color: "var(--main-secondary-color)", padding: 0, margin: 0, }}>{applicant.applicant.address}</p>
                      </div>
                      <a style={{ color: "var(--main-color)", marginBottom: "2px" }}   href={`http://maps.google.com/maps/dir/413+industrial+dr,+north+wales+pa/${encodeURIComponent(applicant.applicant.address)}`} download={applicant.applicant.driverLicense}>
                        <HiArrowSmRight style={{fontSize: "20px", padding: "6px 6px 6px 6px", borderRadius: "var(--border-radius)", border: "1px solid var(--input-bg-color)" }}/>
                      </a>
                    </div>
                    <br />
                    <Button onClick={() => setOpenDelete(true)} width="334px">Удалить Кандидата</Button>
                  </div>
                }
                <div onClick={() => toggleExpand(applicant.id)} style={{ display: "flex", alignItems: "center", padding: "0", paddingTop: "0", marginTop: "15px", borderRadius: "var(--border-radius)", cursor: "pointer" }}>
                  <p style={{ margin: 0, padding: 0, flex: 1 }}>{expandedId === applicant.id ? 'Свернуть' : ' Просмотерть больше'}</p>
                  <HiOutlineChevronDown style={{ marginTop: "4px", fontSize: "16px", transform: expandedId === applicant.id ? "rotate(180deg)" : "rotate(0deg)" }} />
                </div>
              </QContainer>
              <Divider style={{ marginTop: '30px' }} />
            </div>
            </>
          ))}
        </>
      }
    </div>
  )
}

export default ApplicantsProtected;
