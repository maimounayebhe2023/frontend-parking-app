import { useState } from "react"
import { Container } from "react-bootstrap";
import axios from "axios";

const SortieForm = () =>{
    const [errors, setErrors] = useState('');
    let [codePin, setCodePin] = useState('');
    const [message, setMessage] = useState ('');
    const [succes, setSucces] = useState('');
    const validate = () => {
       if(!codePin.trim()){
            setErrors("le code pin est requis")
            return false ;
       }
       setErrors(' ')
       return true;
    }
    const handleChange = (e) =>{
        setCodePin (e.target.value);
        setMessage("");
        setErrors("");
    }
    const handleSubmit =async (e) =>{
        e.preventDefault();
        if(!validate()) return ;
        try{
            const response = await axios.patch( `http://localhost:8000/api/enregistrement/${codePin}`, codePin)
            setCodePin('');
            console.log(response.data)
            setSucces(response.data.message)
        }catch(error){
            if(error.response ){
                console.log(error.response.data )
            }
           setMessage(error.response?.data?.message)
        }
    }
    return(
        <Container className=" justify-content-center align-items-center w-100">
           {succes && <p className="alert alert-success" >{succes}</p>}
           {message && <p className="alert alert-danger" >{message}</p>}
              
            <form onSubmit={handleSubmit} className="w-100 bg-light p-5 rounded shadow">
                <h3 className="text-center mb-4">Enregistrer une sortie</h3>
                <div className="mb-3 text-start">
                    <label className="form-label ">Code PIN :</label>
                    <input
                        type="text"
                        name="code_pin"
                        className="form-control"
                        value={codePin}
                        onChange={handleChange}
                        placeholder="Saisissez le code PIN"
                    />
                    {errors && <p className='text-danger'>{errors}</p> }
              </div>
                
                <button type="submit" className="btn btn-primary w-100 mb-3">
                    Valider la sortie
                </button>

            </form>
        </Container>

    )
    
}
export default SortieForm ;