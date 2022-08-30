import {Card, Tabs} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import UserComponent from './UserComponent';
import MerchantComponent from './MerchantComponent';


function HomeBody() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'User_Template',
      content: 'User Template',
      accessibilityLabel: 'All customers',
      panelID: 'user_template',
      custom_content: <UserComponent />
    },
    {
      id: 'Merchant_Template',
      content: 'Merchant Template',
      panelID: 'merchant_template',
      custom_content: <MerchantComponent />
    }
  ];

  return (
    <Card>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <Card.Section title={tabs[selected].custom_content}>


        </Card.Section>
      </Tabs>
    </Card>
  );
}

export default HomeBody;