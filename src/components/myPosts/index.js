import { View, Text, StyleSheet } from "react-native"

export function MeusPosts(){
    return(
        <View style={styles.container}>
            <Text style={styles.titulo}>teste postagem</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        backgroundColor: '#fff',
        marginBottom: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius:4
    },
    titulo:{
        fontWeight: 'bold',
        fontSize:16
    }
})