import {FormLayout,TextField,Select,Button,Heading} from '@shopify/polaris';
import {useState, useCallback, useEffect} from 'react';

function UserComponent() {
    const [curtitle, setTitle] = useState('This is Title');
    const [curbody, setBody] = useState('This is Description');
    const [curLocation, setLocation] = useState('localuser');
    const [curPrevData, setPrevData] = useState({});
  

    const options = [
        {label: 'Local', value: 'localuser'},
        {label: 'Remote', value: 'remoteuser'}
      ];

  const titlechange = useCallback((newValue) => setTitle(newValue), []);
  const bodychange = useCallback((newValue) => setBody(newValue), []);
  const locationchange = useCallback((newValue) => setLocation(newValue), []);
  

    


   useEffect(()=>{
     getpredata();
    console.log(curPrevData)
   },[])
 
    const getpredata = async ()=>{
      let getResponse  = await fetch(`/api/getdetails/${shop}`,{
        method:"GET"})
      const result1 = await getResponse.json();  
        console.log(result1)
         setPrevData(result1);
    }

  

  
  //Shop
  let shop = new URL(location.href).searchParams.get("shop");
  if (curLocation == 'localuser') {
    var User = { inside: [{title:curtitle, msgbody:curbody}], remote: ["", ""] };
  } else {
    var User = { inside: ["", ""], remote: [{title:curtitle, msgbody:curbody}] };
  }
  
  let data = {shop:shop, user:JSON.stringify(User), merchant:''} 
  
  //Save Data or Update data
  let saveData;
  if(curPrevData.length < 1){

    saveData=  async()=>{
          let response  = await fetch(`/api/savedetails`,{
                            method:"POST",
                            headers:{
                                    'Access-Control-Allow-Origin':'*',
                                    'Content-Type':'application/json'
                                    },
                            body: JSON.stringify(data)
                          })
          let result = await response.json();    
          console.log(result);
          getpredata();
          console.log('insert details')
    }                      
  }else{

    
    saveData = async()=>{
      if (curLocation == 'localuser') {
        var User = { inside: [{title:curtitle, msgbody:curbody}], remote: ["", ""] };
      } else {
        var User = { inside: ["", ""], remote: [{title:curtitle, msgbody:curbody}] };
      }
      
      let data = JSON.stringify(User) 
      console.log('data>>>',data)
      console.log('update details')
            let response  = await fetch(`/api/updatedetails/${curPrevData[0]._id}`,{
                                method:"PATCH",
                                headers:{
                                        'Access-Control-Allow-Origin':'*',
                                        'Content-Type':'application/json'
                                        },
                                body: JSON.stringify(data)
                            })
            let result = await response.json();    
            console.log(result);
            getpredata();
    }
  }


 


  

  return (
    <>

    <FormLayout>
    <center><Heading>User Template</Heading></center>
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