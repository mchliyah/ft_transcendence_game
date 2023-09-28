import Protection from "./Protection";

const ProtectConfirmation = (props: any) => {
    return (
        <Protection name="confirmation" child={props.children}/>
    );
}

export default ProtectConfirmation;