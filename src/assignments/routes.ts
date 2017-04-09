import * as Hapi from "hapi";
import * as Joi from "joi";
import { IServerConfigurations } from "../configurations";
import * as Boom from "boom";

import AssignmentController from "./assignment-controller";
import { exerciseSubmissionPayload, exerciseSubmission, peerReview } from "./schemas";

export default function (server: Hapi.Server, serverConfigs: IServerConfigurations, database: any) {

    const assignmentController = new AssignmentController(serverConfigs, database);
    server.bind(assignmentController);

    server.route({
        method: 'POST',
        path: '/courses/{courseId}/exercise/{exerciseId}/submission',
        config: {
            description: 'Do a submission for an exercise.',
            validate: {
                payload: exerciseSubmissionPayload
            },
            response: {
                schema: exerciseSubmission
            },
            tags: ['api'],
            handler: assignmentController.postExerciseSubmission
        }
    });

    server.route({
        method: 'GET',
        path: '/courses/{courseId}/exercise/{exerciseId}/submission',
        config: {
            description: 'List of all submissions on an exercise.',
            response: {
                schema: Joi.object({
                    data: Joi.array().items(exerciseSubmission)
                          .description("List of submissions.")
                })
            },
            tags: ['api'],
            handler: assignmentController.getExerciseSubmissions,
        }
    });

    server.route({
        method: 'GET',
        path: '/courses/{courseId}/exercise/{exerciseId}/submission/{submissionId}',
        config: {
            description: 'Details of submission of given ID.',
            response: {
                schema: exerciseSubmission
            },
            tags: ['api'],
            handler: assignmentController.getExerciseSubmissionById
        }
    });

    server.route({
        method: 'GET',
        path: '/assignments/peerReview',
        config: {
            description: 'List of peer review requests.',
            response: {
                schema: Joi.object({
                    data: Joi.array().items(peerReview)
                })
            },
            tags: ['api'],
            handler: assignmentController.getPeerReviewRequests
        }
    });

    server.route({
        method: 'PUT',
        path: '/assignments/peerReview/{requestId}',
        config: {
            description: 'Approve/dis-approve a peer review request.',
            validate: {
                payload: Joi.object({
                    approved: Joi.bool().default(true),
                    notes: null
                })
            },
            response: {
                schema: peerReview
            },
            tags: ['api'],
            handler: assignmentController.editPeerReviewRequest
        }
    });

}