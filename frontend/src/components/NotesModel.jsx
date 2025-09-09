import axios from 'axios';
import React, { useEffect, useState } from 'react'

const NotesModel = ({isOpen, onClose, note, onSave}) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    useEffect(()=>{
        setTitle(note ? note.title : "");
        setContent(note ? note.content : "");
        setError("")
    }, [note])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const payload = { title, content };

      if (note) {
        // Update note
        const { data } = await axios.put(
          `${__API_URL__}/api/notes/update/${note._id}`,
          payload,
          { withCredentials: true }
        );
        onSave(data);
      } else {
        // Create new note
        const { data } = await axios.post(
          `${__API_URL__}/api/notes/create`,
          payload,
          { withCredentials: true }
        );
        onSave(data.note || data);
      }

      onClose(); // close modal after success
        }catch(err){
             setError("Failed to save note");
        }
    }
    if(!isOpen) return(null);

  return (
    <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
        <div className='bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md'>
            <h2 className='text-2xl font-semibold text-white mb-4'>{note ? "Edit Note" : "Create Notes"}</h2>
            {error && <p className='text-red-400 mb-4'>{error}</p>} 
            <form onSubmit={handleSubmit} className='space-y-4'>
        <div> 
            <input type="text" value={title} onChange={(e)=> setTitle(e.target.value)} placeholder='Note Title' className='w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus focus:ring-2 focus:ring-blue-500'/>
        </div>
        <div> 
            <textarea type="text" 
            value={content} 
            onChange={(e)=> setContent(e.target.value)} 
            placeholder='Note content' 
            className='w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus focus:ring-2 focus:ring-blue-500'
            rows={4}
            required
            />
        </div>
            <div className='flex space-x-2'>
                <button type="submit" 
                className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
                    {note ? "Update" : "Create"}
                </button>
                  <button onClick={onClose}
                className='bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700'>
                    Cancel
                </button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default NotesModel