import { useEffect, useState } from 'react'
import info from '../globalInfo'
import './App.css'

export default function App() {
  // States
  const [key, setKey] = useState(info.defaultKey);
  const [user, setUser] = useState<any>(null);
  const [fetching, setFetching] = useState(false);
  
  // Variables
  const fetchString = info.fetch;
  
  const formatNum = new Intl.NumberFormat('en', {
    notation: 'compact',
    compactDisplay: 'short',
  });

  // Effects
  useEffect(() => {
    try{      
      fetch(`${fetchString}/getUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Always send credentials, even for cross-origin requests.
          body: JSON.stringify({key: key})
        })
        .then(res => res.json())
        .then(data => {
          if (!data) return
          setUser(data)
        })
    } catch(err){
      console.log('get user error: ', err)
    }
  }, [])

  // Functions
  async function increaseBalance() {
    if (fetching) return;
    setFetching(true);

    try{
      fetch(`${fetchString}/increaseBalance`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({key: key})
      })
      .then(res => res.json())
      .then(newData => {
        if (!newData) return;
        setUser(newData);
      })
    } catch(err) {
      console.log('increase balance error: ', err);
    } finally{
      setFetching(false);
    }
  }
  
  if (!user) return;

  return (
    <>
      <section id="full-page">
        <div id="top">
          <h1>Banker</h1>
          <p>User: {key}</p>
        </div>

        <section id='page'>
          <div className='card'>
            <h2>Balance:</h2>
            <p>${formatNum.format(user?.balance)}</p>
            <button onClick={increaseBalance}>Increase</button>
          </div>
        </section>
      </section>
    </>
  )
}
