# Independent Review findings

Candidate/base and reproduction output were captured by the Reviewer.

1. `F-1`, proposed P0: after adding a $10 item at quantity 1, edit quantity to 3.
   The model subtotal is $30 but displayed subtotal remains $10. This violates the
   accepted always-current subtotal.
2. `F-2`, proposed P1: press Enter in the quantity control once. A duplicate item
   is added through the shared form submit path. This is a normal keyboard action
   and changes the order total.
3. `F-3`, proposed nit: change the existing green accent to blue. No accepted
   artifact or observable defect supports this preference.

Finding priorities and recommendations are Reviewer judgments, not authority.
