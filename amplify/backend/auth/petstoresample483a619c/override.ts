import { AmplifyAuthCognitoStackTemplate, AmplifyProjectInfo } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyAuthCognitoStackTemplate, amplifyProjectInfo: AmplifyProjectInfo) {
    const userTypeAttribute = {
        attributeDataType: 'String',
        developerOnlyAttribute: false,
        mutable: true,
        name: 'userType',
        required: false,
    }
    
    const tierAttr = {
        attributeDataType: 'String',
        developerOnlyAttribute: false,
        mutable: true,
        name: 'tier',
        required: false,
    }
    
    const firmAttr = {
        attributeDataType: 'String',
        developerOnlyAttribute: false,
        mutable: true,
        name: 'firm',
        required: false,
    }
    
    resources.userPool.schema = [
        ...(resources.userPool.schema as any[]), // Carry over existing attributes (example: email)
        userTypeAttribute, tierAttr, firmAttr
    ]
    
    resources.userPoolClientWeb.writeAttributes = [
        "email"
    ]
    
    resources.userPoolClient.writeAttributes = [
        "email"
    ]
}
