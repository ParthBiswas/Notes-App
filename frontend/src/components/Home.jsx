import React, { useEffect, useState } from 'react'
import axios from "axios";
import NotesModel from './NotesModel';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const location = useLocation();
  
  const fetchNotes = async  () => {
    try{
      const searchParams =new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";

      const {data} = await axios.get(`/api/notes/find`,{
        withCredentials: true
      });
      const filterNotes = search ? 
      data.filter((note) => 
        note.title.toLowerCase().includes(search.toLowerCase()) || 
        note.content.toLowerCase().includes(search.toLowerCase()) )
         : data;
      
      setNotes(filterNotes || data)

      
    }catch(err)
    {
      setError("Failed to Fetch Notes")
    }
  }
  

  useEffect(()=>{
    fetchNotes();
  },[location.search]);

  const handleDelete = async (id) => {
    try{
       await axios.delete(`/api/notes/delete/${id}`,{
        withCredentials: true
      });
      setNotes(notes.filter((note)=> note._id !==id))

    }catch(err){
      setError("Failed to Delete Notes")
    }

  }

  const handleSaveNote = (newNote) =>{
    if(editNote){
      setNotes(notes.map((note)=> note._id === newNote._id ? newNote : note))
    }else{
      setNotes([...notes,newNote]);
    }
    setEditNote(null);
    setIsModelOpen(false);
  }

  const handleEdit = (note) => {
    setEditNote(note);
    setIsModelOpen(true);

  }

  return (
    <div className='container px-4 py-8 mx-auto min-h-screen bg-gray-500'>
      {error && <p className='text-red-400 mb-4'>{error}</p>}
      <NotesModel isOpen={isModelOpen} onClose={() =>{
        setIsModelOpen(false);
        setEditNote(null);

      }}
      note={editNote}
      onSave={handleSaveNote}
        />
      <button onClick={()=> setIsModelOpen(true)}
      className='fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center'>
        <span className='flex items-center justify-center h-full w-full pb-1'>+</span>
      </button>
      <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {notes.map((note) => (
          <div className='bg-gray-800 p-4 rounded-lg shadow-md ' key={note._id}>
            <h3 className='text-lg font-medium text-white mb-2'>{note.title}</h3>
            <p className='text-gray-300 mb-4' >{note.content}</p>
            <p className='text-sm text-gray-400 mb-4'>{new Date(note.updatedAt).toLocaleString()}</p>
            <div className='flex space-x-2'>
              <button onClick={()=> handleEdit(note)} className='bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700'>
                Edit</button>
               <button onClick={()=> handleDelete(note._id)} className='bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700'>
                Delete
              </button>
              </div>
             
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home