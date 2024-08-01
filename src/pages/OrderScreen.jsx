import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Divider from '@mui/material/Divider';
import Button from '../shared/UI/Button';
import QContainer from '../shared/UI/QContainer';
import '../shared/styles/Variables.scss';
import Input from '../shared/UI/Input';

const OrderScreen = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [mealType, setMealType] = useState('b');
    const [cart, setCart] = useState({ b: {}, l: {}, d: {} });
    const [imageLoaded, setImageLoaded] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [showForm, setShowForm] = useState(false)
    const [success, setSuccess] = useState(false)
    const [fullName, setFullName] = useState('')
    const [truckNum, setTruckNum] = useState('')
    const [takeOutDate, setTakeOutDate] = useState('')

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const menuCollection = collection(db, 'menu');
                const menuSnapshot = await getDocs(menuCollection);
                const menuList = menuSnapshot.docs.map(doc => doc.data());
                setMenuItems(menuList);
        
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const filteredMenuItems = menuItems.filter(item => item.id.startsWith(mealType));

    const getTotalItemsForMealType = (mealType) => {
        return Object.values(cart[mealType]).reduce((acc, qty) => acc + qty, 0);
    };

    const handleAddToCart = (id) => {
        if (getTotalItemsForMealType(mealType) < 5) {
            setCart(prevCart => ({
                ...prevCart,
                [mealType]: {
                    ...prevCart[mealType],
                    [id]: (prevCart[mealType][id] || 0) + 1
                }
            }));
        } else {
            alert(`You can only add up to 5 dishes for ${mealType === 'b' ? 'Breakfast' : mealType === 'l' ? 'Lunch' : 'Dinner'}.`);
        }
    };

    const handleIncreaseQuantity = (id) => {
        if (cart[mealType][id] < 5 && getTotalItemsForMealType(mealType) < 5) {
            setCart(prevCart => ({
                ...prevCart,
                [mealType]: {
                    ...prevCart[mealType],
                    [id]: prevCart[mealType][id] + 1
                }
            }));
        } else {
            alert(`You can only have up to 5 of the same item or 5 total dishes for ${mealType === 'b' ? 'Breakfast' : mealType === 'l' ? 'Lunch' : 'Dinner'}.`);
        }
    };

    const handleDecreaseQuantity = (id) => {
        setCart(prevCart => {
            const updatedMealCart = { ...prevCart[mealType] };
            if (updatedMealCart[id] > 1) {
                updatedMealCart[id] -= 1;
            } else {
                delete updatedMealCart[id];
            }
            return {
                ...prevCart,
                [mealType]: updatedMealCart
            };
        });
    };

    const getCartItems = () => {
        const allCartItems = [];
        for (const [meal, items] of Object.entries(cart)) {
            for (const [id, quantity] of Object.entries(items)) {
                const menuItem = menuItems.find(item => item.id === id);
                if (menuItem) {
                    allCartItems.push({
                        ...menuItem,
                        meal,
                        quantity
                    });
                }
            }
        }
        return allCartItems;
    };

    const submitOrder = async () => {
        const orderData = {
            cart,
            fullName,
            truckNum,
            takeOutDate,
            timestamp: new Date(),
            id: fullName.split(' ').join('') + takeOutDate.split('-').join('')
        };
    
        try {
            const ordersCollection = collection(db, 'orders');
            await addDoc(ordersCollection, orderData);
            alert('Order successfully submitted!');
            setCart({ b: {}, l: {}, d: {} });
            setFullName('');
            setTruckNum('');
            setTakeOutDate('');
            setSuccess(true)
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Error submitting order. Please try again.');
        }
    };
    
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
        {success && 
            <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'var(--main-bg-color)', zIndex: 1000000000000000, alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                <div style={{textAlign: 'center'}}>
                    <h2 style={{color: 'var(--main-color)', padding: 0, margin: 0}}>Ваш заказ принят!</h2>
                    <p style={{color: 'var(--main-secondary-color)', padding: 0, margin: 0}}>Вы можете закрыть страницу.</p>
                </div>
            </div>
        }
            <div>
                <div style={{ margin: "auto", maxWidth: "100%", padding: 0, position: 'sticky', top: 0, backgroundColor: 'var(--main-bg-color)', zIndex: 1000 }}>
                    <div style={{ margin: "auto", maxWidth: "320px", padding: 10 }}>
                        {showConfirm ?
                            <>
                                <h2 style={{ padding: 0, margin: 0 }}>Подтвердите заказ</h2>
                                <p style={{ padding: 0, margin: 0, color: 'var(--main-secondary-color)' }}>Убедитесь в том что заказ верный</p>
                            </>
                            :
                            <>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <h2 style={{ padding: 0, margin: 0 }}>{mealType === 'b' ? 'Завтрак' : (mealType === 'l' ? 'Обед' : 'Ужин')}</h2>
                                    <h2 style={{ padding: 0, margin: 0, fontSize: 16 }}>{getTotalItemsForMealType(mealType)}/5</h2>
                                </div>
                                <p style={{ padding: 0, margin: 0, color: 'var(--main-secondary-color)' }}>Выберите 5 блюд на {mealType === 'b' ? 'завтрак' : (mealType === 'l' ? 'обед' : 'ужин')}</p>
                            </>
                        }
                    </div>
                    <Divider />
                </div>
                {showForm ?
                    <div style={{ width: "100%", margin: "auto", minHeight: '100vh' }}>
                        <>
                            <QContainer>
                                <h3 style={{ margin: 0, padding: 0 }}>Как вас зовут?<span style={{ color: "var(--danger-color)" }}>*</span></h3>
                                <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>Пожалуйста введите своё полное имя.</p>
                                <Input borderRadius={10} name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} def placeholder="Пр. Иван Иванов" />
                            </QContainer>
                            <br />
                            <Divider />
                        </>
                        <>
                            <QContainer>
                                <h3 style={{ margin: 0, padding: 0 }}>Номер трака<span style={{ color: "var(--danger-color)" }}>*</span></h3>
                                <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>Пожалуйста введите номер своего трака.</p>
                                <Input borderRadius={10} name="truckNum" value={truckNum} onChange={(e) => setTruckNum(e.target.value)} def placeholder="Пр. AB-12" />
                            </QContainer>
                            <br />
                            <Divider />
                        </>
                        <>
                            <QContainer>
                                <h3 style={{ margin: 0, padding: 0 }}>Дата получения заказа<span style={{ color: "var(--danger-color)" }}>*</span></h3>
                                <p style={{ marginTop: 0, padding: 0, color: 'var(--main-secondary-color)' }}>Выберите дату получения заказа.</p>
                                <input min={today} value={takeOutDate} onChange={(e) => setTakeOutDate(e.target.value)} type="date" style={{ padding: 8.25, border: '1px solid var(--border-color)', outline: 'none', backgroundColor: "var(--main-input-bg-color)", color: "var(--main-color)", border: "1px solid var(--main-bg-secondary-color)", borderRadius: 10 }} />
                            </QContainer>
                            <br />
                            <Divider />
                        </>
                    </div>
                    :
                    <>
                        {showConfirm ?
                            <div style={{ width: "100%", margin: "auto", minHeight: '100vh' }}>
                                {getCartItems().map(item => (
                                    <div key={item.id}>
                                        <div style={{ width: "320px", margin: "auto", paddingTop: 20, paddingBottom: 0, position: 'relative' }}>
                                            <div style={{ height: 200, overflow: 'hidden', borderRadius: 10 }}>
                                                {!imageLoaded[item.id] && (
                                                    <div style={{ width: '320px', height: '200px', backgroundColor: 'var(--main-bg-secondary-color)', position: 'absolute', borderRadius: 10, zIndex: 5 }} />
                                                )}
                                                <img
                                                    src={item.photoURL}
                                                    alt={item.dishName}
                                                    style={{ width: '100%', height: 'auto', zIndex: '10', display: imageLoaded[item.id] ? 'block' : 'none' }}
                                                    onLoad={() => setImageLoaded(prev => ({ ...prev, [item.id]: true }))}
                                                />
                                            </div>
                                            <p>{item.dishName} - {item.quantity} шт.</p>
                                            <p>Тип питания: {item.meal === 'b' ? 'Завтрак' : item.meal === 'l' ? 'Обед' : 'Ужин'}</p>
                                        </div>
                                        <Divider />
                                    </div>
                                ))}
                            </div>
                            :
                            <div style={{ width: "100%", margin: "auto", minHeight: '100vh' }}>
                                {filteredMenuItems.map((item) => (
                                    <div key={item.id}>
                                        <div style={{ width: "320px", margin: "auto", paddingTop: 20, paddingBottom: 20, position: 'relative' }}>
                                            <div style={{ height: 200, overflow: 'hidden', borderRadius: 10 }}>
                                                {!imageLoaded[item.id] && (
                                                    <div style={{ width: '320px', height: '200px', backgroundColor: 'var(--main-bg-secondary-color)', position: 'absolute', borderRadius: 10, zIndex: 5 }} />
                                                )}
                                                <img
                                                    src={item.photoURL}
                                                    alt={item.dishName}
                                                    style={{ width: '100%', height: 'auto', zIndex: '10', display: imageLoaded[item.id] ? 'block' : 'none' }}
                                                    onLoad={() => setImageLoaded(prev => ({ ...prev, [item.id]: true }))}
                                                />
                                            </div>
                                            <p>{item.dishName}</p>
                                            {cart[mealType][item.id] ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <Button special={true} secondary={true} borderRadius={10} onClick={() => handleDecreaseQuantity(item.id)}>-</Button>
                                                    <Button disabled={true} special={true} secondary={true} borderRadius={10} width={'100%'}>{cart[mealType][item.id]}</Button>
                                                    <div style={{ opacity: getTotalItemsForMealType(mealType) === 5 ? 0.5 : 1 }}>
                                                        <Button disabled={getTotalItemsForMealType(mealType) === 5} special={true} secondary={true} borderRadius={10} onClick={() => handleIncreaseQuantity(item.id)}>+</Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button secondary={getTotalItemsForMealType(mealType) === 5} disabled={getTotalItemsForMealType(mealType) === 5} borderRadius={10} width={'100%'} onClick={() => handleAddToCart(item.id)}>Добавить</Button>
                                            )}
                                        </div>
                                        <Divider />
                                    </div>
                                ))}
                            </div>
                        }
                    </>
                }
            </div>
            <div style={{ position: 'sticky', bottom: 0, backgroundColor: 'var(--main-bg-color)', width: '100%', borderTop: '1px solid var(--input-bg-color)', paddingBottom: 'env(safe-area-inset-bottom)', zIndex: 1000 }}>
                {!showForm ?
                    <>
                        {showConfirm ?
                            <div>
                                <div style={{ flexDirection: 'row', display: 'flex', width: '320px', margin: 'auto', justifyContent: 'space-between', paddingTop: 10 }}>
                                    <Button onClick={() => setShowConfirm(false)} secondary={true} borderRadius={10} width="48%">Назад</Button>
                                    <Button onClick={submitOrder} borderRadius={10} width="48%">Подтвердить</Button>
                                </div>
                            </div>
                            :
                            <>
                                {mealType === 'b' ?
                                    <div style={{ width: '320px', margin: 'auto', justifyContent: 'space-between', paddingTop: 10 }}>
                                        <Button secondary={getTotalItemsForMealType(mealType) < 5} disabled={getTotalItemsForMealType(mealType) < 5} onClick={() => setMealType('l')} borderRadius={10} width="320px">Далее</Button>
                                    </div>
                                    :
                                    <div style={{ flexDirection: 'row', display: 'flex', width: '320px', margin: 'auto', justifyContent: 'space-between', paddingTop: 10 }}>
                                        <Button onClick={mealType === 'd' ? () => setMealType('l') : () => setMealType('b')} secondary={true} borderRadius={10} width="48%">Назад</Button>
                                        <Button disabled={getTotalItemsForMealType(mealType) < 5} secondary={getTotalItemsForMealType(mealType) < 5} onClick={mealType === 'l' ? () => setMealType('d') : () => setShowForm(true)} borderRadius={10} width="48%">Далее</Button>
                                    </div>
                                }
                            </>
                        }
                    </>
                    :
                    <div style={{ flexDirection: 'row', display: 'flex', width: '320px', margin: 'auto', justifyContent: 'space-between', paddingTop: 10 }}>
                        <Button onClick={() => setShowForm(false)} secondary={true} borderRadius={10} width="48%">Назад</Button>
                        <Button disabled={fullName == '' || truckNum == '' || takeOutDate == ''} secondary={fullName == '' || truckNum == '' || takeOutDate == ''} onClick={() => {
                            if(fullName !== '' && truckNum !== '' && takeOutDate !== '') {
                                setShowConfirm(true)
                                setShowForm(false)
                            }
                        }} borderRadius={10} width="48%">Далее</Button>
                    </div>
                }
            </div>
        </>
    );
};

export default OrderScreen;
