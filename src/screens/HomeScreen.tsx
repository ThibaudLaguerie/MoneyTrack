import { DrawerScreenProps } from '@react-navigation/drawer'
import React from 'react'
import { Animated, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { Divider, Icon } from 'react-native-elements'
import ExpenseComponent from '../components/ExpenseComponent'
import HeaderComponent from '../components/HeaderComponent'
import SwipeComponent from '../components/SwipeComponent'
import SwipeableComponent from '../components/SwipeableComponent'
import { WINDOW_WIDTH } from '../constants'
import { useAuth } from '../contexts/AuthContext'
import { useFirestore } from '../contexts/FirestoreContext'
import styles from '../styles'
import { Expense, RootStackParamsList } from '../types'
type Props = DrawerScreenProps<RootStackParamsList, 'Home'>

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
    const store = useFirestore()
    const auth = useAuth()

    const [lastExpenses, setLastExpenses] = React.useState<Expense[]>([])

    React.useEffect(() => {
        if (route.params?.token == 'autolog') {
            auth.getUserInfo()
        }
        store.getExpenses()
    }, [])

    React.useEffect(() => {
        if (store.expenses.length != 0) {
            getLastExpenses()
        }
    }, [store.expenses])

    const getLastExpenses = () => {
        if (store.expenses.length >= 3) {
            setLastExpenses([store.expenses[0], store.expenses[1], store.expenses[2]])
        } else {
            let tempExpenses: Expense[] = []
            store.expenses.map((expense) => {
                tempExpenses.push(expense)
            })
            setLastExpenses(tempExpenses)
        }
    }

    return (
        <View style={styles.container}>
            <HeaderComponent title="Mon compte" handleDrawer={() => navigation.toggleDrawer()} />
            <View>
                <Text style={styles.hello}>Bonjour</Text>
                <Text style={[styles.hello, { fontWeight: 'bold', fontSize: WINDOW_WIDTH * 0.18, }]}>{auth.userInfo?.firstname}</Text>
            </View>
            <Divider style={styles.bigDivider} />
            <View style={styles.columnContainer}>
                 <TouchableOpacity onPress={() => navigation.navigate('Expenses')}
                    style={[styles.seeAllButton, styles.containerPadding, styles.containerMargin, {width: '90%'}]}>
                    <Text style={styles.seeAllButtonText}>Voir tout</Text>
                </TouchableOpacity>
                <Divider style={styles.bigDivider} />
                <Text style={styles.flatlistText}>Dernières dépenses</Text>
            </View>
            <FlatList
                data={lastExpenses}
                keyExtractor={(item, index) => item.title + item.category + item.amount.toString() + "_" + index}
                renderItem={({ item }) => <SwipeableComponent expense={item} navigation={navigation} />}
            />
            <View style={{margin: WINDOW_WIDTH * 0.03}}>
                <Icon onPress={() => navigation.navigate('Creation', {})}
                    type="entypo" name="circle-with-plus" size={WINDOW_WIDTH * 0.10} color="#E4B429" />
            </View>
        </View>
    )
}

export default HomeScreen