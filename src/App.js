import { Amplify, API, Auth } from 'aws-amplify';

import { withAuthenticator,
  Expander, 
  ExpanderItem,
  Button,  
  Heading,
  Link,
  Flex,
  View,
  Text, 
  Divider,Tabs, TabItem, Alert, TextField, Grid,TextAreaField,
  useTheme} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useState } from 'react';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

let isAlertVisible, setIsAlertVisible, alertHeading, alertMessage , alertVariation, isCustomerUser;
let petId, orderNumber, authResult ='', storeId;

function App({ signOut, user }) {
  [isAlertVisible, setIsAlertVisible] = useState(false);
  var roles = user.signInUserSession.idToken.payload ['cognito:groups'] || [];
  return (
      <>
      <View as="header" padding="10px" backgroundColor="var(--amplify-colors-white)">
        <Flex direction="row" justifyContent="space-around" alignItems="center">
          <Flex>
              <Link>Home</Link>
          </Flex>
          <Heading level={4} textAlign="center">
            Welcome to Research Rights
          </Heading>
          <Heading level={6} textAlign="center">
            Hello {user.username}
            <Button variation="link" onClick={signOut}>Sign out</Button>
          </Heading>
        </Flex>
      </View>

      <View as="div" minHeight="100px">
        <Flex direction="row" justifyContent="space-around" alignItems="center">
          <Flex width="7%"></Flex>
          <Flex width="86%" direction="column" padding="10px">
            {isAlertVisible ? (
              <Alert variation={alertVariation} isDismissible={true} heading={alertHeading}>{alertMessage}</Alert>
            ) : null}
          </Flex>
          <Flex width="7%"></Flex>
        </Flex>
      </View>
      
      <View as="div" padding="10px">

        <Flex direction="row" justifyContent="space-around" alignItems="center">
          <Flex width="7%"></Flex>
          <View padding="10px" as="div" level={1} textAlign="center" backgroundColor="var(--amplify-colors-white)" 
            width="86%" minHeight="300px" boxShadow="3px 3px 5px 6px var(--amplify-colors-neutral-60)" opacity="90">
            
            <Tabs defaultIndex={0} >
              <TabItem title="Action simulation">
                <Grid templateColumns="1fr 1fr">
                  <View textAlign="left">
              
                        
                    <Expander type="multiple" defaultValue={['line-1','line-2','line-3']}>
  
                      <Divider orientation="horizontal" />
                      
                       
                      <div>
                        <ExpanderItem title="Customer role type actions" value="line-1">
                          <Text textAlign="left" variation="info">Customers can search for research. </Text><br/>
                          <Button onClick={() => getData('/ViewResearch', 'GET')}>View Research</Button>
                        </ExpanderItem>
                      </div>
                    </Expander>
                  </View>
                  
                  <View padding="10px" textAlign="left">
                    <TextAreaField isReadOnly={true} rows="20" size="small" 
                      label={
                        <Text fontWeight="bold" fontSize="medium">
                          Authorization query results:
                        </Text>
                    } value={authResult} /> 
                  </View>
                </Grid>
              </TabItem>
            </Tabs>
            
          </View>
          <Flex width="7%"></Flex>
        </Flex>
      </View>
      </>
  );
}

async function getData(actionPath, action) {

  authResult = "";
  setIsAlertVisible(false);
  const apiName = 'petstoreapi';
  const path = actionPath;
  const myInit = {
    headers:{
      Authorization: await getToken("ID")
    }
  };

  if(action == 'GET'){
    API.get(apiName, path, myInit).then(result => {  
      
      alertHeading = "Success!";
      alertVariation = "success";
      alertMessage = result.message;
      setIsAlertVisible(true);
      
      authResult = JSON.stringify(result, null, 2);
      
      return result.body;  
    }).catch(err => { 
      
      //console.log(err.response);
      
      alertHeading = err.response.statusText;
      alertVariation = "error";
      alertMessage = err.response.data.message;
      setIsAlertVisible(true);
      
      authResult = JSON.stringify(err.response.data, null, 2);
     
    });
  }
}

async function getToken(type){
  if("ID" == type)
    return await (Auth.currentSession()).then(data => {return data.getIdToken().getJwtToken()})
  else if("ACCESS" == type)
    return await (Auth.currentSession()).then(data => {return data.getAccessToken().getJwtToken()})
}

export default withAuthenticator(App, 
  { hideSignUp: true , signUpAttributes: ["name"]}
);
