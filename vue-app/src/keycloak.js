import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://localhost:8080/auth",
  realm: "farmaxis", // Substitua pelo seu realm
  clientId: "api-client", // Substitua pelo seu clientId
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

