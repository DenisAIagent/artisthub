import { Router } from 'express';
import { getDashboardMetrics, getRecentActivities } from '../controllers/dashboardController';
// import { authenticateToken } from '../middleware/auth'; // To be created

const router = Router();

/**
 * @swagger
 * /api/v1/dashboard/metrics:
 *   get:
 *     summary: Get dashboard metrics based on user role
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: artistId
 *         schema:
 *           type: string
 *         description: Artist ID to filter metrics (or 'all' for consolidated view)
 *     responses:
 *       200:
 *         description: Dashboard metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     metrics:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                           value:
 *                             type: string
 *                           change:
 *                             type: string
 *                           breakdown:
 *                             type: string
 *                           trend:
 *                             type: string
 *                             enum: [up, down, stable]
 *                           color:
 *                             type: string
 *                     artistId:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 */

// Temporary middleware to simulate authentication (WILL BE REPLACED)
const tempAuthMiddleware = (req: any, res: any, next: any) => {
  // TEMPORARY MOCK USER - TO BE REPLACED WITH REAL JWT AUTH
  req.user = {
    id: 'temp-user-id',
    role: 'marketing_manager',
    artistsAccess: [
      { id: 'temp-artist-1', name: 'Sarah Lopez' },
      { id: 'temp-artist-2', name: 'DJ Mike' },
    ],
  };
  next();
};

// Get dashboard metrics
router.get('/metrics', tempAuthMiddleware, getDashboardMetrics);

/**
 * @swagger
 * /api/v1/dashboard/activities:
 *   get:
 *     summary: Get recent activities timeline
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: artistId
 *         schema:
 *           type: string
 *         description: Artist ID to filter activities (or 'all' for all artists)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of activities to return
 *     responses:
 *       200:
 *         description: Recent activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                       action:
 *                         type: string
 *                       detail:
 *                         type: string
 *                       artist:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [info, success, warning, error]
 *                       metadata:
 *                         type: object
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 */

// Get recent activities
router.get('/activities', tempAuthMiddleware, getRecentActivities);

/**
 * @swagger
 * /api/v1/dashboard/quick-actions:
 *   get:
 *     summary: Get role-based quick actions
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quick actions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                       href:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [primary, secondary, tertiary]
 *       401:
 *         description: User not authenticated
 */

// Get quick actions based on user role
router.get('/quick-actions', tempAuthMiddleware, (req: any, res) => {
  const user = req.user;
  let actions = [];

  switch (user.role) {
    case 'marketing_manager':
      actions = [
        { label: 'Nouvelle campagne', href: '/marketing/campaigns/new', type: 'primary' },
        { label: 'Envoyer newsletter', href: '/marketing/email/new', type: 'secondary' },
        { label: 'Analyser audience', href: '/marketing/analytics', type: 'tertiary' },
        { label: 'Gérer documents', href: '/resources', type: 'tertiary' },
      ];
      break;
    case 'tour_manager':
      actions = [
        { label: 'Nouvelle venue', href: '/booking/venues/new', type: 'primary' },
        { label: 'Créer hold', href: '/booking/holds/new', type: 'secondary' },
        { label: 'Optimiser routing', href: '/booking/routing', type: 'tertiary' },
        { label: 'Documents tournée', href: '/resources', type: 'tertiary' },
      ];
      break;
    case 'financial_manager':
      actions = [
        { label: 'Ajouter revenus', href: '/financial/revenue/new', type: 'primary' },
        { label: 'Enregistrer dépense', href: '/financial/expenses/new', type: 'secondary' },
        { label: 'Générer rapport', href: '/financial/reports/new', type: 'tertiary' },
        { label: 'Voir royalties', href: '/financial/royalties', type: 'tertiary' },
      ];
      break;
    default:
      actions = [
        { label: 'Nouveau projet', href: '/projects/new', type: 'primary' },
        { label: 'Ajouter contact', href: '/contacts/new', type: 'secondary' },
        { label: 'Gérer ressources', href: '/resources', type: 'tertiary' },
        { label: 'Inviter équipe', href: '/team/invite', type: 'tertiary' },
      ];
  }

  res.json({
    success: true,
    data: actions,
  });
});

/**
 * @swagger
 * /api/v1/dashboard/user-profile:
 *   get:
 *     summary: Get current user profile and accessible artists
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *                     artistsAccess:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           avatar:
 *                             type: string
 *       401:
 *         description: User not authenticated
 */

// Get user profile (temporary mock)
router.get('/user-profile', tempAuthMiddleware, (req: any, res) => {
  const user = req.user;

  res.json({
    success: true,
    data: {
      id: user.id,
      firstName: 'Marie', // Will come from database
      lastName: 'Dubois', // Will come from database
      role: user.role,
      artistsAccess: user.artistsAccess,
    },
  });
});

export default router;