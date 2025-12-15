---
title: "All about NATS"
description: "Everything you need to know to get started."
date: "2025-12-15"
image: "/blog/NATS.webp"
---

# Basics

* NATS is a message-oriented middleware system that facilitates data exchange between applications/services.

![Basic NATS protocol](/blog/Pub_Sub.svg)

* NATS utilizes a subject-based messaging paradigm, which involves publishing and listening to messages on named communication channels known as Subjects. In other middleware systems subjects may be called topics, channels, streams (Note: In NATS the term stream is used for a JetStream message storage).

* NATS offers wildcard support to enable flexible subscriptions. Publishers send messages to fully specified subjects, but subscribers can use wildcards to listen to multiple subjects with a single subscription. NATS provides two wildcard characters (* and >) that can substitute for one or more elements within a dot-separated subject.

* The NATS messaging system offers two primary configurations: Core NATS, a lightweight publish-subscribe system, and NATS with JetStream, which adds persistence and advanced features for streaming and durable messaging.

For detailed instructions on how to install NATS, refer to the [Installation Walkthrough](https://docs.nats.io/nats-concepts/what-is-nats/walkthrough_setup).

# NATS vs Kafka

<script src="https://gist.github.com/rahularora27/45fdd958e8676c2ada54afa654599d82.js"></script>

For a more detailed comparison, see [Compare NATS](https://docs.nats.io/nats-concepts/overview/compare-nats).

# Core NATS

* Original NATS which is known for its speed, simplicity and lightweight nature.

* Has the basic messaging patterns — Pub/Sub, Req-Reply and Queue Groups.

* Is in-memory and does not persist any messages by default.

* Prioritizes speed over guaranteed delivery (at-most once).

## Publish/Subscribe Model

* A publisher sends a message on a subject and any active subscriber listening on that subject receives the message (Fan-Out).

* A subscriber can also subscribe to multiple subjects by using wildcards (Fan-In).

* A Message consists of a subject and a payload (in the form of a byte-array).

![Publish Subscribe Model](/blog/Pub_Sub_Model.svg)

To try it out, refer to the [Pub/Sub Walkthrough](https://docs.nats.io/nats-concepts/core-nats/pubsub/pubsub_walkthrough).

## Request-Reply Model

* NATS supports the Request-Reply pattern using its core communication mechanism — publish and subscribe. A Responder subscribes to a subject and whenever a request is published, a response is sent.

* When a request is made to a service (request/reply) and the NATS Server knows there are no services available (since there are no client applications currently subscribing to the subject) the server will send a “no-responders” protocol message back to the requesting client.

![Request Reply Model](/blog/Request_Reply_Model.webp)

To try it out, refer to the [Request-Reply Walkthrough](https://docs.nats.io/nats-concepts/core-nats/reqreply/reqreply_walkthrough).

## Queue Groups

* When subscribers register themselves to receive messages from a publisher, the 1:N fan-out pattern of messaging ensures that any message sent by a publisher, reaches all subscribers that have registered. NATS provides an additional feature named queue, which allows subscribers to register themselves as part of a queue. Subscribers that are part of a queue, form the queue group, and only one randomly chosen subscriber of the queue group will consume a message each time a message is received by the queue group.

* They can be considered a built-in load balancing feature and are ideal for scaling services-
    * Scale up is as simple as running another application
    * Scale down is as simple as terminating an application.

* Request/Reply automatically joins a queue group if two responders are connected to a subject.

* Publish/Subscribe has to be manually configured to join a queue group.

![Queue Group Model](/blog/Queue_Group_Model.webp)

To try it out, refer to the [Queueing Walkthrough](https://docs.nats.io/nats-concepts/core-nats/queue/queues_walkthrough).