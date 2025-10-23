import React, { useState, useEffect } from 'react';

const PlaneManagement = () => {
  const [seatingPlan, setSeatingPlan] = useState({
    rowA: Array(14).fill(0),
    rowB: Array(12).fill(0),
    rowC: Array(12).fill(0),
    rowD: Array(14).fill(0),
  });
  const [activeTab, setActiveTab] = useState('seating');
  const [tickets, setTickets] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [notification, setNotification] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    row: 'A', seat: '', name: '', surname: '', email: ''
  });
  const [searchForm, setSearchForm] = useState({ row: 'A', seat: '' });

  useEffect(() => {
    fetchSeatingPlan();
  }, []);

  const fetchSeatingPlan = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/seating-plan');
      const data = await response.json();
      setSeatingPlan(data);
    } catch (error) {
      showNotification('Error fetching seating plan', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleBuySeat = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/buy-seat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          row: bookingForm.row.toLowerCase(),
          seat: parseInt(bookingForm.seat),
          name: bookingForm.name,
          surname: bookingForm.surname,
          email: bookingForm.email
        })
      });
      const data = await response.json();
      if (data.success) {
        showNotification(data.message, 'success');
        setBookingForm({ row: 'A', seat: '', name: '', surname: '', email: '' });
        fetchSeatingPlan();
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Error booking seat', 'error');
    }
  };

  const handleCancelSeat = async (row, seat) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cancel-seat?row=${row}&seat=${seat}`, { method: 'DELETE' });
      const data = await response.json();
      showNotification(data.message, data.success ? 'success' : 'error');
      if (data.success) fetchSeatingPlan();
    } catch (error) {
      showNotification('Error cancelling seat', 'error');
    }
  };

  const handleFindFirstAvailable = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/first-available');
      const data = await response.json();
      if (data.row && data.seat) {
        showNotification(`First available: Row ${data.row}, Seat ${data.seat}`, 'success');
      } else {
        showNotification('No seats available', 'error');
      }
    } catch (error) {
      showNotification('Error finding seat', 'error');
    }
  };

  const handleSearchTicket = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/search-ticket?row=${searchForm.row}&seat=${searchForm.seat}`);
      const data = await response.json();
      if (data.available) {
        showNotification(data.message, 'success');
      } else {
        const ticket = data.ticket;
        const person = ticket.person;
        showNotification(`Booked by: ${person.name} ${person.surname} - £${ticket.price}`, 'info');
      }
    } catch (error) {
      showNotification('Error searching ticket', 'error');
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tickets');
      const data = await response.json();
      setTickets(data.tickets || []);
      setTotalSales(data.totalSales || 0);
    } catch (error) {
      showNotification('Error fetching tickets', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets();
    }
  }, [activeTab]);

  const styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: 'system-ui, sans-serif' },
    header: { background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', padding: '2rem', color: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' },
    headerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '2.5rem', fontWeight: 'bold', margin: 0 },
    subtitle: { fontSize: '0.9rem', opacity: 0.9, marginTop: '0.5rem' },
    statsBox: { background: 'rgba(255,255,255,0.2)', padding: '1rem 2rem', borderRadius: '15px' },
    tabsContainer: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    tabs: { display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.9)', padding: '0.75rem', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
    tab: (isActive) => ({ flex: 1, padding: '1rem', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white', color: isActive ? 'white' : '#333', boxShadow: isActive ? '0 8px 20px rgba(102,126,234,0.4)' : '0 2px 5px rgba(0,0,0,0.1)', transform: isActive ? 'scale(1.05)' : 'scale(1)' }),
    content: { maxWidth: '1200px', margin: '0 auto 2rem', padding: '2rem', background: 'rgba(255,255,255,0.95)', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', minHeight: '500px' },
    sectionTitle: { fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '2rem' },
    seatingArea: { background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem', borderRadius: '15px', marginTop: '2rem' },
    rowContainer: { marginBottom: '1.5rem' },
    rowLabel: { fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' },
    seatsRow: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem' },
    seat: (isBooked) => ({ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', background: isBooked ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', transition: 'all 0.3s', border: 'none' }),
    formContainer: { maxWidth: '500px', margin: '2rem auto' },
    formGroup: { marginBottom: '1.5rem' },
    label: { display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333', fontSize: '0.9rem' },
    input: { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '1rem', boxSizing: 'border-box' },
    button: { width: '100%', padding: '1rem', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', boxShadow: '0 4px 15px rgba(102,126,234,0.4)', marginTop: '1rem' },
    secondaryButton: { padding: '0.75rem 1.5rem', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', background: 'linear-gradient(135deg, #ffa500 0%, #ff6347 100%)', color: 'white', boxShadow: '0 4px 15px rgba(255,165,0,0.4)' },
    notification: (type) => ({ position: 'fixed', top: '2rem', right: '2rem', padding: '1.25rem 2rem', borderRadius: '12px', color: 'white', fontWeight: 'bold', zIndex: 1000, boxShadow: '0 8px 25px rgba(0,0,0,0.3)', background: type === 'success' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : type === 'error' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }),
    ticketCard: { padding: '1.5rem', margin: '1rem 0', borderRadius: '15px', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    ticketInfo: { flex: 1 },
    ticketPrice: { fontSize: '2rem', fontWeight: 'bold', color: '#f5576c' },
    legend: { display: 'flex', gap: '2rem', marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.7)', borderRadius: '10px' },
    legendItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' },
    legendBox: (color) => ({ width: '40px', height: '40px', borderRadius: '8px', background: color })
  };

  return (
    <div style={styles.container}>
      {notification && <div style={styles.notification(notification.type)}>{notification.message}</div>}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>✈️ Plane Management</h1>
            <p style={styles.subtitle}>Book your perfect seat today!</p>
          </div>
          <div style={styles.statsBox}>
            <div style={{fontSize: '0.9rem'}}>Seats Booked</div>
            <div style={{fontSize: '2rem', fontWeight: 'bold'}}>{seatingPlan.ticketCount || 0}</div>
          </div>
        </div>
      </div>
      <div style={styles.tabsContainer}>
        <div style={styles.tabs}>
          {[
            { id: 'seating', label: '🪑 Seating Plan' },
            { id: 'book', label: '🎫 Book Seat' },
            { id: 'search', label: '🔍 Search' },
            { id: 'tickets', label: '📊 Tickets' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={styles.tab(activeTab === tab.id)}
              onMouseEnter={(e) => { if (activeTab !== tab.id) { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)'; }}}
              onMouseLeave={(e) => { if (activeTab !== tab.id) { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'; }}}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div style={styles.content}>
        {activeTab === 'seating' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 style={styles.sectionTitle}>Aircraft Seating Layout</h2>
              <button style={styles.secondaryButton} onClick={handleFindFirstAvailable}>✨ Find Available</button>
            </div>
            <div style={styles.seatingArea}>
              {['A', 'B', 'C', 'D'].map(row => {
                const rowData = seatingPlan[`row${row}`] || [];
                return (
                  <div key={row} style={styles.rowContainer}>
                    <div style={styles.rowLabel}>Row {row}</div>
                    <div style={styles.seatsRow}>
                      {rowData.map((status, index) => (
                        <button key={index} style={styles.seat(status === 1)} onClick={() => status === 1 && handleCancelSeat(row, index + 1)}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div style={styles.legend}>
                <div style={styles.legendItem}>
                  <div style={styles.legendBox('linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)')}></div>
                  <span>Available</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={styles.legendBox('linear-gradient(135deg, #f093fb 0%, #f5576c 100%)')}></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'book' && (
          <div>
            <h2 style={styles.sectionTitle}>Reserve Your Seat</h2>
            <div style={styles.formContainer}>
              <div style={styles.formGroup}>
                <label style={styles.label}>🪑 Select Row</label>
                <select style={styles.input} value={bookingForm.row} onChange={(e) => setBookingForm({...bookingForm, row: e.target.value})}>
                  <option value="A">Row A</option>
                  <option value="B">Row B</option>
                  <option value="C">Row C</option>
                  <option value="D">Row D</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>💺 Seat Number</label>
                <input type="number" style={styles.input} value={bookingForm.seat} onChange={(e) => setBookingForm({...bookingForm, seat: e.target.value})} placeholder="1-14" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>👤 First Name</label>
                <input type="text" style={styles.input} value={bookingForm.name} onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})} placeholder="John" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>👨‍👩‍👧‍👦 Surname</label>
                <input type="text" style={styles.input} value={bookingForm.surname} onChange={(e) => setBookingForm({...bookingForm, surname: e.target.value})} placeholder="Doe" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>📧 Email</label>
                <input type="email" style={styles.input} value={bookingForm.email} onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})} placeholder="john@example.com" />
              </div>
              <button style={styles.button} onClick={handleBuySeat}>✅ Book This Seat Now!</button>
            </div>
          </div>
        )}
        {activeTab === 'search' && (
          <div>
            <h2 style={styles.sectionTitle}>Find Your Ticket</h2>
            <div style={styles.formContainer}>
              <div style={styles.formGroup}>
                <label style={styles.label}>🪑 Row</label>
                <select style={styles.input} value={searchForm.row} onChange={(e) => setSearchForm({...searchForm, row: e.target.value})}>
                  <option value="A">Row A</option>
                  <option value="B">Row B</option>
                  <option value="C">Row C</option>
                  <option value="D">Row D</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>💺 Seat Number</label>
                <input type="number" style={styles.input} value={searchForm.seat} onChange={(e) => setSearchForm({...searchForm, seat: e.target.value})} />
              </div>
              <button style={styles.button} onClick={handleSearchTicket}>🔍 Search Ticket</button>
            </div>
          </div>
        )}
        {activeTab === 'tickets' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2 style={styles.sectionTitle}>Booking Overview</h2>
              <div style={{...styles.statsBox, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                <div style={{fontSize: '0.9rem'}}>Total Sales</div>
                <div style={{fontSize: '2rem', fontWeight: 'bold'}}>£{totalSales.toFixed(2)}</div>
              </div>
            </div>
            <div>
              {tickets.length === 0 ? (
                <div style={{textAlign: 'center', padding: '4rem', color: '#999'}}>
                  <div style={{fontSize: '4rem'}}>📋</div>
                  <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>No tickets booked yet</p>
                </div>
              ) : (
                tickets.map((ticket, index) => {
                  const person = ticket.person;
                  return (
                    <div key={index} style={styles.ticketCard}>
                      <div style={styles.ticketInfo}>
                        <h3>Row {ticket.row}, Seat {ticket.seat}</h3>
                        <p><strong>👤 Name:</strong> {person.name} {person.surname}</p>
                        <p><strong>📧 Email:</strong> {person.email}</p>
                      </div>
                      <div style={styles.ticketPrice}>£{ticket.price}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaneManagement;
