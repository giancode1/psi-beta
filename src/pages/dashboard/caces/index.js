import React from "react"
import { withRoleProtection } from "../../../utils/auth"

export const getServerSideProps = withRoleProtection(['caces', 'ti']);

export default function Caces(){
    return(
        <h1>Hola</h1>
    )
}