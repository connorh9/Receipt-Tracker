import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Summary from "../screens/Summary"
import Analysis from "../screens/Analysis"
import Capture from "../screens/Capture"

const Tab = createBottomTabNavigator();

export default function Tabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Summary" component={Summary} />
            <Tab.Screen name="Analysis" component={Analysis} />
            <Tab.Screen name="Capture" component={Capture} />
        </Tab.Navigator>
    )
}