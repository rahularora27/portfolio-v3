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

# Message Delivery

## At-Most-Once

In the core NATS system, messages are delivered at most once. This means:

* If a subscriber is connected and listening, it will receive the message.

* If a subscriber is not connected or is temporarily unavailable, the message is lost. There is no persistence or retry mechanism in core NATS.

* This is the fastest and simplest delivery guarantee, but it’s not suitable for applications that require guaranteed delivery.

## At-Least-Once

JetStream adds persistence and other features that enable at-least-once delivery. This means:

* Messages are stored in a stream (similar to a Kafka topic).

* Subscribers can consume messages from the stream.

* If a subscriber fails to acknowledge a message, JetStream will redeliver it.

* This guarantees that a message will be delivered at least once, but it doesn’t guarantee that it will be processed exactly once.

## Exactly-Once

As JetStream provides at-least-once delivery, we need to implement additional mechanisms to ensure that messages are processed exactly once. Here’s how we can achieve that:

* Idempotent Consumers:
    * The key is to make your consumer logic idempotent. This means that if a consumer receives the same message multiple times, processing it multiple times has the same effect as processing it only once.
    * This is typically achieved by tracking which messages have already been processed.

* Message IDs and Deduplication:
    * Assign Unique IDs: Ensure that each message has a unique ID (e.g., a UUID). The producer should generate this ID and include it in the message payload.
    * Deduplication Logic: The consumer must maintain a record of the message IDs it has already processed. This can be done using a database, a cache, or any other persistent storage.
    * Check for Duplicates: When a consumer receives a message, it first checks if the message ID is already in its processed list.

# Ordering Guarantee

NATS implements source ordered delivery per publisher. This means, messages from a given single publisher will be delivered to all eligible subscribers in the order in which they were originally published. There are no guarantees of message delivery order amongst multiple publishers.

# JetStream

* Durable streaming layer built on top of core NATS.

* Offers advanced features like stream management, consumer configurations, and data retention policies.

* Supports message persistence and guaranteed delivery (at-least once).

* Provides fault tolerance through replication.

* JetStream also provides “exactly-once” delivery-
    * Publishing: When sending a message, the application adds a unique ID. JetStream remembers these IDs for a while. If the same ID is sent again, JetStream knows it’s a duplicate and ignores it.
    * Subscribing: JetStream uses a special “double check” system when sending messages to subscribers. This prevents messages from being accidentally resent if something goes wrong.

To learn about JetStream policies and limits, see [JetStream](https://docs.nats.io/nats-concepts/jetstream).

# NATS Tools

## NATS Client Libraries

The most common form of connecting to the NATS messaging system will be through an application built with any of the [40+ client libraries](https://docs.nats.io/using-nats/developer) available for NATS.

The client application will connect to an instance of the NATS server, be it a single server, a cluster of servers or even a global super-cluster such as [Synadia Cloud](https://www.synadia.com/cloud), sending and receiving messages via a range of subscribers.

For NATS with Java, refer [nats.java](https://github.com/nats-io/nats.java).

## NATS CLI

The NATS Command Line Tool is the easiest way to interact with, test and manage NATS and JetStream from a terminal or from scripts.

Download [here](https://github.com/nats-io/natscli/releases).

To try it out, watch this [video](https://www.youtube.com/watch?v=OFUjbv1ItJc).

# Logging

When nats-server runs as a standalone process or within a container, its logs are typically written to stdout (standard output), visible directly in the terminal.

<script src="https://gist.github.com/rahularora27/b7a27fa86b7e07f26f9881626fe9df86.js"></script>