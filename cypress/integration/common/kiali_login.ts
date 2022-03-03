import { Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";

const KUBEADMIN_USERNAME = 'jenkins';
const KUBEADMIN_IDP = 'my_htpasswd_provider';

Given('user opens base url', () => {
    cy.visit('/'); // visits baseUrl which is set in plugins/index.js
    cy.window().then((win: any) => {
        if (win.SERVER_FLAGS?.authDisabled) {
            cy.log(win.SERVER_FLAGS?.authDisabled + 'skipping login, console is running with auth disabled');
            return;
        }

        // Make sure we clear the cookie in case a previous test failed to logout.
        cy.clearCookie('openshift-session-token');
    });
});

And('user clicks Log In With OpenShift', () => {
    const idp = KUBEADMIN_IDP;
    cy.log(`  Logging in as ${KUBEADMIN_USERNAME}`);
    cy.get('button[type="submit"]').should('be.visible');
    cy.get('button[type="submit"]').click();
});

And('user clicks my_htpasswd_provider', () => {
    cy.get('body').then(($body) => {
        if ($body.text().includes(KUBEADMIN_IDP)) {
            cy.contains(KUBEADMIN_IDP)
                .should('be.visible')
                .click();
        }
    });
})

And('user fill in username and password', () => {
    cy.get('#inputUsername').type('' || KUBEADMIN_USERNAME);
    cy.get('#inputPassword').type('' || Cypress.env('BRIDGE_KUBEADMIN_PASSWORD'));

    cy.get('button[type="submit"]').click()

})

Then('user see console in URL', () => {
    cy.url().should('include', 'console')
})


