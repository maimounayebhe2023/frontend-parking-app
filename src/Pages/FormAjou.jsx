import axios from 'axios';
import React, { useState } from 'react';
import { Container } from 'react-bootstrap'

const AjoutForm = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        tel: '',
        statut:'',
        plaque_immatricu: '',
        type_engin: '',
        categorie_nom: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({});
    const validate = () =>{
        const newErrors = {};

        if(!formData.nom.trim()){
            newErrors.nom = 'le nom est requis'
        }

        if(!formData.prenom.trim()){
         newErrors.prenom = 'le prenom est requis'
        }

        if(!formData.tel.trim()){
            newErrors.tel = 'le tel est requis'
        }/*else if (!/^\d{8,15}$/.test(formData.tel)) {
            newErrors.tel = 'Numéro de téléphone invalide (8 à 15 chiffres)';          
        }*/
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;


    };
    const handleChange = (e) =>{
        setFormData({...formData, [e.target.name]: e.target.value});
        setErrors({...errors, [e.target.name]: ''});
        setMessage({...message, [e.target.message ] : ''})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validate()) return ;

        try{
            await
            axios.post('http://localhost:8000/api/enregistrement/ajouter', formData);
            alert('Enregistrement ajouté avec succès')
            setFormData({nom:'', prenom:'', tel: '', plaque_immatricu: '', type_engin: '', categorie_nom:'' })
        }catch(error){
        alert("Erreur lors de l'ajout")
        console.error(error);
        }
    };
    return (
        
        <Container className=" justify-content-center align-itmes-center w-100" >
           <form onSubmit={handleSubmit} className='w-100 bg-light p-5 rounded shadow'>
            <h3 className="text-center  mb-5 mt-2">Enregistrer une nouvelle entreée</h3>
                <div className="mb-3 text-start">
                    <label className="form-label">Nom :</label>
                    <input  className="form-control border border-8" type="text" name='nom' placeholder='Barry' value={formData.nom} onChange={handleChange}/>
                    {errors.nom && <p className='text-danger'>{errors.nom}</p> }
                </div>
                <div className='mb-3 text-start'>
                    <label className='form-label' >Prenom :</label>
                    <input className='form-control' type="text" name='prenom' placeholder='Thierno Maimouna' value={formData.prenom} onChange={handleChange}/>
                    {errors.prenom && <p className='text-danger'>{errors.prenom}</p>}
                </div>
                <div className='mb-3 text-start'>
                    <label className='form-label'>type de personne :</label>
                    <select className='form-select' name="categorie_nom" value={formData.categorie_nom} onChange={handleChange}>
                        <option value="personnel">Personnel</option>
                        <option value="etudiant">Etudiant</option>
                        <option value="enseignant">Enseignant</option>
                        <option value="parent">Parent</option>
                        <option value="autres">Autres</option>
                    </select>
                    {errors.categorie_nom && <p  className='text-danger' >{errors.categorie_nom}</p>}
                </div>
                <div className='mb-3 text-start'>
                    <label className='form-label'>Tel :</label>
                    <input className='form-control' type="text" name='tel' value={formData.tel} onChange={handleChange} placeholder='611789655' />
                    {errors.tel && <p className='text-danger'>{errors.tel}</p> }
                </div>
                <div className='mb- text-start'>
                    <label className='form-label'>Type de l'engin :</label>
                    <select className='form-select' name="type_engin" value={formData.type_engin} onChange={handleChange}>
                        <option value="Moto">Moto</option>
                        <option value="Voiture">Voiture</option>
                    </select>
                    {errors.type_engin && <p className='text-dager'>{errors.type_engin}</p> }
                </div>
                <div className='mb-3 text-start mt-3'>
                    <label className='form-label'>Plaque d'immatriculation :</label>
                    <input className='form-control' type="text" value={formData.plaque_immatricu} name='plaque_immatricu' onChange={handleChange} placeholder='AT-5MPOGT 20' />
                    {errors.plaque_immatricu && <p className='text-danger'> {errors.plaque_immatricu} </p>}
             </div>
                <button type='submit' className='btn btn-primary w-50 mb-3 '>Ajouter</button>
           </form>
        </Container>
    )

}


export default AjoutForm;
