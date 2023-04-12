import { useState } from 'react'
import './App.css'
const BASE_URL = import.meta.env.VITE_BASE_URL

function App() {
  const [select, setSelect] = useState('')
  const [input, setInput] = useState('')
  const [data, setData] = useState([])

  const handleClick = () => {
    fetch(`http://${BASE_URL}/${select}/${input}`)
      .then(response => response.json())
      .then(data => {
        let list = data.states || data
        setData(list)
      })
      .catch(error => console.error(error));
  }


  return (
    <div className="">
        <h1 className='m-5'>Population by Countries, States and Cities</h1>
      <div className='w-50 mx-auto'>
      <div className="input-group">
        <select className="form-select" id="floatingSelect" aria-label="Floating label select example" onChange={(e) => { setSelect(e.target.value) }}>
          <option selected>Choose an option</option>
          <option value="country">Country</option>
          <option value="city">City</option>
          <option value="state">State</option>
        </select>
        <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" onChange={(e) => { setInput(e.target.value) }}></input>
        <button type="button" class="btn btn-primary" disabled={!select || !input} onClick={handleClick}>Search</button>
      </div>
      {data.population ?
        <h2 className='mt-4'>Population: {data.population}</h2>
        :
        data.map((state) => (
          <div className='mt-4' key={state.name}>
            <h3 >{state.name}</h3>
            <ul className='list-group list-group-flush'>
              {state.cities.map((city) => (
                <li className='list-group-item' key={city.name}>
                  {city.name} - Población: {city.population}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
