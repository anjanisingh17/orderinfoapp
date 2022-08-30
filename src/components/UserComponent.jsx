import {FormLayout,TextField,Select,Button,Heading} from '@shopify/polaris';
import {useState, useCallback} from 'react';

function UserComponent() {
    const [curtitle, setTitle] = useState('This is Title');
    const [curbody, setBody] = useState('This is Description');
    const [curLocation, setLocation] = useState('Local');
  

    const options = [
        {label: 'Local', value: 'localuser'},
        {label: 'Remote', value: 'remoteuser'}
      ];

  const titlechange = useCallback((newValue) => setTitle(newValue), []);
  const bodychange = useCallback((newValue) => setBody(newValue), []);
  const locationchange = useCallback((newValue) => setLocation(newValue), []);
  

  const saveData = async ()=>{

    let data = {title:curtitle, body:curbody, location:curLocation}
    let response  = await fetch(`https://738d-115-166-143-82.ngrok.io/api/savedetails`,{
        method:"POST",
        headers:{
            'Access-Control-Allow-Origin':'*',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    })

    let result = await response.json();
    
    console.log(result);
  }


  return (
    <>

    <FormLayout>
    <center>    <Heading>User Template</Heading>    </center>
        <TextField
        label="Subject"
        value={curtitle}
        onChange={titlechange}
        autoComplete="off" 
        />

        <TextField
        label="Email body"
        value={curbody}
        onChange={bodychange}
        autoComplete="off"
        multiline={4} 
        />

       <Select
        label="User Location"
        options={options}
        onChange={locationchange}
        value={curLocation}
       />

    <Button primary onClick={saveData}>Save User Template</Button>

    </FormLayout>    


    </>
 
  );
}

export default UserComponent;