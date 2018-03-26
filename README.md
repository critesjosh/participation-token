# Participation Token

The Participation Token contracts and software allow a set of administrators/organisers to give non-transferable tokens to 
people that participate in the community. In practice, admins will first need to obtain a "proof of participation" from 
the users for a given event or action. Then, the admins will sign a message giving the persmission to the vetted users to
mint X tokens. 

Participation tokens have no intrinsic values, but could be used by communities for various reasons ; 
+ Organize an annual lottery based on annual participation score
+ Create a priority list for events with restricted number of participants, where users with most tokens are prioritized.
+ Act as a publicly available social metric of "how involved" in a certain community someone is. 
+ "Proof" of participation orcacle

# Participation Token issuance logic

In order to redeem tokens, participants need to receive a signed message from a certain number of administrators.
This signed message contains the **address of the Participation Token Issuance contract**, **address of the participant**,
a **nonce** (representing an event for example or task) and the **amount of tokens** the user can mint. With enough valid
signatures, the users will be able to mint some tokens via the ParticipationTokenController.sol contract.
