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

vec4 applyLightIntensity(in vec3 cameraSpacePosition, out vec3 lightDirection)
{
    vec3 lightDifference =  cameraSpaceLightPos - cameraSpacePosition;
    float lightDistanceSqr = dot(lightDifference, lightDifference);
    lightDirection = lightDifference * inversesqrt(lightDistanceSqr);
	
    return lightIntensity * (1 / ( 1.0 + lightAttenuation * sqrt(lightDistanceSqr)));
}

void main()
{
    vec3 lightDir = vec3(0.0);
    vec4 attenIntensity = applyLightIntensity(cameraSpacePosition, lightDir);

    float cosAngIncidence = dot(normalize(vertexNormal), lightDir);
    cosAngIncidence = clamp(cosAngIncidence, 0, 1);
	
    outputColor = (diffuseColor_ * attenIntensity * cosAngIncidence) + (diffuseColor_ * ambientIntensity);
}