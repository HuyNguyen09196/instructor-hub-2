import { useEffect, useState, useMemo } from "react"
import swal from 'sweetalert';

export const ModalList = (props) => {
    const { courses, setCourses, checked, setChecked, selectedStudents, setSelectedStudents } = props

    //Makes a fetch to the users Asana to get student info based on selected course
    const [studentsState, setStudentsState] = useState([])
    let currentClass = sessionStorage.getItem('currentClass')
    let gid = sessionStorage.getItem(currentClass)
    let asanaToken = sessionStorage.getItem('asanaToken')
    useEffect(() => {
        if(!currentClass){
            swal('No course selected')
        } else {
            fetch(`https://app.asana.com/api/1.0/projects/${gid}/tasks`, {
                headers: {
                    Authorization: `Bearer ${asanaToken}`
                }
            })
            .then(result => result.json())
            .then(data => {
                setStudentsState(data.data)})
        }
    }, [])
    function clickStudent(e){
        //Checks to see if box was unclicked
        //Removes student from state used to add changes if so
        if(!e.target.checked){
            let findKey = e.target.id
            //Filters the selected students to remove the unchecked student
            let deleteObj = selectedStudents.filter(obj => {
               return obj.gid !== findKey
            })
            setSelectedStudents(deleteObj)
            // console.log('index', index)
            // if(index >= 0) selectedStudents.splice(index, 1)

        } else {
            //Checks to see if there is already anything in the state
            //If not it only puts the obj in without spread operator
            if(selectedStudents === []){
                let obj = {
                    gid: e.target.id,
                    name: e.target.value
                }
                setSelectedStudents(obj)    
            } else {
                let obj = {
                    gid: e.target.id,
                    name: e.target.value
                }
                setSelectedStudents([...selectedStudents, obj])    
            }
        }
    }
    console.log(selectedStudents)
    return (
        <>
            {/* Checks to see if the students are present in selectedStudent state 
            if they are it keeps the check in the box even if modal is closed */}
            {studentsState.map((student) => {
                return (selectedStudents.find(selected => selected.gid === student.gid) ?                   
                <li key={student.gid}><input type="checkbox" value={student.name} onChange={(e) => clickStudent(e)} id={student.gid} checked={true}/> {student.name}</li>
                :
                <li key={student.gid}><input type="checkbox" value={student.name} onChange={(e) => clickStudent(e)} id={student.gid} checked={false} /> {student.name}</li>)
            })}

        </>
    )
}