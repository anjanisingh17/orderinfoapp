import {FormLayout,TextField,Select,Button,Heading} from '@shopify/polaris';
import {useState, useCallback} from 'react';

function MerchantComponent() {
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
  

  return (
    <>
     
    <FormLayout>
    <center>     <Heading>Merchant Template</Heading> </center> 
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

    <Button primary>Save Merchant Template</Button>

    </FormLayout>    


    </>
 
  );
}

export default MerchantComponent;