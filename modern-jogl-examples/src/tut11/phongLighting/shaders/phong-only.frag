#version 330

// Outputs
#define FRAG_COLOR  0

in vec4 diffuseColor_;
in vec3 vertexNormal;
in vec3 cameraSpacePosition;

layout (location = FRAG_COLOR) out vec4 outputColor;

uniform vec3 modelSpaceLightPos;

uniform vec4 lightIntensity;
uniform vec4 ambientIntensity;

uniform vec3 cameraSpaceLightPos;

uniform float lightAttenuation;

const vec4 specularColor = vec4(0.25, 0.25, 0.25, 1.0);
uniform float shininessFactor;


float calcAttenuation(in vec3 cameraSpacePosition, out vec3 lightDirection)
{
    vec3 lightDifference =  cameraSpaceLightPos - cameraSpacePosition;
    float lightDistanceSqr = dot(lightDifference, lightDifference);
    lightDirection = lightDifference * inversesqrt(lightDistanceSqr);
	
    return (1 / (1.0 + lightAttenuation * sqrt(lightDistanceSqr)));
}

void main()
{
    vec3 lightDir = vec3(0.0);
    float atten = calcAttenuation(cameraSpacePosition, lightDir);
    vec4 attenIntensity = atten * lightIntensity;

    vec3 surfaceNormal = normalize(vertexNormal);
	
    vec3 viewDirection = normalize(-cameraSpacePosition);
    vec3 reflectDir = normalize(reflect(-lightDir, surfaceNormal));
    float phongTerm = dot(viewDirection, reflectDir);
    phongTerm = clamp(phongTerm, 0, 1);
    phongTerm = dot(surfaceNormal, lightDir) > 0.0 ? phongTerm : 0.0;
    phongTerm = pow(phongTerm, shininessFactor);
	
    outputColor = (specularColor * attenIntensity * phongTerm) + (diffuseColor_ * ambientIntensity);
}