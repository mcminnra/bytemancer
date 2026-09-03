// Emacs surface: emits a deftheme .el. The palette is bound in a `let` under its
// new names; syntax/diff/git/bracket faces pull palette-name refs from roles, while
// org.* and non-color attributes (:box/:height/:extend/:strike-through) are hardcoded
// here — Emacs rendering details with no cross-surface meaning.

import type { BuildContext, OutputFile, RawRole, Template } from "../src/types";

function render(ctx: BuildContext): OutputFile[] {
  const R = ctx.rawRoles;
  // Palette *name* backing a role's foreground (roles.toml stores names, and the
  // `let` binds those exact symbols — so we emit `,name`, not a hex literal).
  const n = (role: string): string => R[role].color;
  // Full `:foreground ,name [:weight bold] [:slant italic] [:underline ,name]` fragment.
  const frag = (role: string): string => {
    const r: RawRole = R[role];
    let s = `:foreground ,${r.color}`;
    if (r.bold) s += " :weight bold";
    if (r.italic) s += " :slant italic";
    if (r.underline) s += ` :underline ,${r.color}`;
    return s;
  };

  const letBindings = Object.entries(ctx.palette)
    .map(([name, hex]) => `      (${name} "${hex}")`)
    .join("\n");

  const content = `;;; bytemancer-theme.el  --- Bytemancer - Theme custom tailored to mancing bytes -*- lexical-binding: t; -*-

;; Maintainer: Ryder McMinn
;; Author: Ryder McMinn
;; Version: 0.1.0
;; Package-Requires: ((emacs "27.1"))

;;; Commentary:

;; GENERATED FILE -- do not edit by hand.
;; Regenerate from the bytemancer repo.

;;; Code:


;;; Theme definition:
(deftheme bytemancer "Theme custom tailored to mancing bytes.")

;; Palette (generated from flavors/dark.toml)
(let (
${letBindings}
    )

  (custom-theme-set-faces
   'bytemancer

   ;; Basic faces
   \`(default ((t (:background ,raised :foreground ,fg))))
   \`(cursor ((t (:background ,${n("ui.cursor")}))))
   \`(region ((t (:background ,selection))))
   \`(highlight ((t (:background ,selection))))
   \`(hl-line ((t (:background ,overlay))))
   \`(fringe ((t (:background ,raised))))
   \`(internal-border ((t (:background ,base))))
   \`(child-frame-border ((t (:background ,base))))
   \`(match ((t (:background ,selection :foreground ,yellow))))
   \`(secondary-selection ((t (:background ,selection))))
   \`(isearch ((t (:background ,${R["ui.search.current"].bg} :foreground ,${n("ui.search.current")} :weight bold))))
   \`(isearch-fail ((t (:background ,red_bg :foreground ,red))))
   \`(lazy-highlight ((t (:background ,${R["ui.search.other"].bg} :foreground ,${n("ui.search.other")}))))
   \`(link ((t (${frag("ui.link")}))))

   ;; Completion faces
   \`(completions-annotations ((t (:foreground ,fg_muted :slant italic))))
   \`(show-paren-match ((t (:background ,purple :foreground ,raised :weight bold))))
   \`(show-paren-mismatch ((t (:background ,red :foreground ,raised :weight bold))))
   \`(window-divider ((t (:background nil :foreground ,raised))))
   \`(vertical-border ((t (:background nil :foreground ,raised))))
   \`(error ((t (:foreground ,red :weight bold))))
   \`(warning ((t (:foreground ,orange :weight bold))))
   \`(success ((t (:foreground ,green :weight bold))))

   ;; Font lock faces (syntax highlighting)
   \`(font-lock-builtin-face ((t (${frag("syntax.builtin")}))))
   \`(font-lock-comment-face ((t (${frag("syntax.comment")}))))
   \`(font-lock-constant-face ((t (${frag("syntax.constant")}))))
   \`(font-lock-number-face ((t (${frag("syntax.number")}))))
   \`(font-lock-function-name-face ((t (${frag("syntax.function")}))))
   \`(font-lock-keyword-face ((t (${frag("syntax.keyword")}))))
   \`(font-lock-operator-face ((t (${frag("syntax.operator")}))))
   \`(font-lock-string-face ((t (${frag("syntax.string")}))))
   \`(font-lock-doc-face ((t (${frag("syntax.doc")}))))
   \`(font-lock-type-face ((t (${frag("syntax.type")}))))
   \`(font-lock-variable-name-face ((t (${frag("syntax.variable")}))))
   \`(font-lock-variable-use-face ((t (${frag("syntax.variable")}))))
   \`(font-lock-property-use-face ((t (${frag("syntax.property")}))))
   \`(font-lock-warning-face ((t (:foreground ,red :weight bold))))

   ;; Helm
   \`(helm-source-header ((t (:background ,overlay :foreground ,fg))))
   \`(helm-selection ((t (:background ,selection))))
   \`(helm-M-x-key ((t (:foreground ,yellow :box (:line-width 1 :color ,yellow)))))
   \`(helm-match ((t (:foreground ,yellow))))
   \`(helm-ff-prefix ((t (:background ,yellow :foreground ,raised))))
   \`(helm-ff-directory ((t (:foreground ,red))))

   ;; Solaire
   \`(solaire-default-face ((t (:background ,base :foreground ,fg))))
   \`(solaire-fringe-face ((t (:background ,base :foreground ,fg))))
   \`(solaire-line-number-face ((t (:background ,base :foreground ,fg_muted))))
   \`(solaire-mode-line-face ((t (:background ,raised :foreground ,fg))))
   \`(solaire-mode-line-inactive-face ((t (:background ,raised :foreground ,fg))))
   \`(solaire-header-line-face ((t (:background ,raised :foreground ,fg))))

   ;; Mode line
   \`(mode-line ((t (:background ,raised :foreground ,fg :box (:line-width 1 :color ,overlay)))))
   \`(mode-line-inactive ((t (:background ,raised :foreground ,fg))))
   \`(mode-line-active ((t (:background ,overlay :foreground ,fg))))
   \`(mode-line-highlight ((t (:background ,purple :foreground ,raised))))

   ;; Header line
   \`(header-line ((t (:background ,raised :foreground ,fg))))
   \`(header-line-inactive ((t (:background ,raised :foreground ,fg))))

   ;; Minibuffer
   \`(minibuffer-prompt ((t (:foreground ,purple :weight bold))))

   ;; Line numbers
   \`(line-number ((t (:background ,raised :foreground ,${n("ui.line_number")}))))
   \`(line-number-current-line ((t (:background ,raised :foreground ,${n("ui.line_number.active")} :weight bold))))

   ;; Diff mode (used by diff-hl-diff-goto-hunk)
   \`(diff-added ((t (:background ,${n("diff.added.bg")}))))
   \`(diff-removed ((t (:background ,${n("diff.removed.bg")}))))
   \`(diff-refine-added ((t (:background ,${n("diff.added.emphasis")}))))
   \`(diff-refine-removed ((t (:background ,${n("diff.removed.emphasis")}))))
   \`(diff-header ((t (:background ,raised :foreground ,fg))))
   \`(diff-file-header ((t (:background ,raised :foreground ,fg))))
   \`(diff-hunk-header ((t (:background ,selection :foreground ,fg))))

   ;; Ediff
   \`(ediff-current-diff-A ((t (:background ,${n("diff.removed.bg")}))))
   \`(ediff-current-diff-B ((t (:background ,${n("diff.added.bg")}))))
   \`(ediff-fine-diff-A ((t (:background ,${n("diff.removed.emphasis")}))))
   \`(ediff-fine-diff-B ((t (:background ,${n("diff.added.emphasis")}))))
   \`(ediff-even-diff-A ((t (:background ,${n("diff.removed.bg")}))))
   \`(ediff-even-diff-B ((t (:background ,${n("diff.added.bg")}))))
   \`(ediff-odd-diff-A ((t (:background ,${n("diff.removed.bg")}))))
   \`(ediff-odd-diff-B ((t (:background ,${n("diff.added.bg")}))))

   ;; Magit Diff
   \`(magit-diff-added ((t (:background ,${n("diff.added.bg")}))))
   \`(magit-diff-added-highlight ((t (:background ,${n("diff.added.emphasis")}))))
   \`(magit-diff-removed ((t (:background ,${n("diff.removed.bg")}))))
   \`(magit-diff-removed-highlight ((t (:background ,${n("diff.removed.emphasis")}))))
   \`(magit-diff-context ((t (:foreground ,fg))))
   \`(magit-diff-context-highlight ((t (:background ,raised :foreground ,fg))))
   \`(magit-diff-hunk-heading ((t (:background ,overlay :foreground ,fg))))
   \`(magit-diff-hunk-heading-highlight ((t (:background ,selection :foreground ,fg))))
   \`(magit-section-highlight ((t (:background ,overlay))))

   ;; Rainbow Delimiters
   \`(rainbow-delimiters-base-error-face ((t (:foreground ,red))))
   \`(rainbow-delimiters-base-face ((t (:foreground ,fg))))
   \`(rainbow-delimiters-depth-1-face ((t (:foreground ,${n("ui.bracket.1")}))))
   \`(rainbow-delimiters-depth-2-face ((t (:foreground ,${n("ui.bracket.2")}))))
   \`(rainbow-delimiters-depth-3-face ((t (:foreground ,${n("ui.bracket.3")}))))
   \`(rainbow-delimiters-depth-4-face ((t (:foreground ,${n("ui.bracket.1")}))))
   \`(rainbow-delimiters-depth-5-face ((t (:foreground ,${n("ui.bracket.2")}))))
   \`(rainbow-delimiters-depth-6-face ((t (:foreground ,${n("ui.bracket.3")}))))
   \`(rainbow-delimiters-depth-7-face ((t (:foreground ,${n("ui.bracket.1")}))))
   \`(rainbow-delimiters-depth-8-face ((t (:foreground ,${n("ui.bracket.2")}))))
   \`(rainbow-delimiters-depth-9-face ((t (:foreground ,${n("ui.bracket.3")}))))
   \`(rainbow-delimiters-mismatched-face ((t (:foreground ,${n("ui.bracket.unmatched")} :weight bold))))
   \`(rainbow-delimiters-unmatched-face ((t (:foreground ,${n("ui.bracket.unmatched")} :weight bold))))

   ;; Org mode (Emacs-only; references palette names directly, not roles)
   \`(org-document-title ((t (:foreground ,orange :weight bold :height 1.5))))
   \`(org-document-info ((t (:foreground ,fg :slant italic))))
   \`(org-document-info-keyword ((t (:foreground ,fg_muted :slant italic))))
   \`(org-meta-line ((t (:foreground ,fg_muted :slant italic))))
   \`(org-ellipsis ((t (:foreground ,fg_muted))))
   \`(org-list-dt ((t (:foreground ,cyan :weight bold))))
   \`(org-checkbox ((t (:foreground ,purple :weight bold))))
   \`(org-checkbox-statistics-todo ((t (:foreground ,red))))
   \`(org-checkbox-statistics-done ((t (:foreground ,fg_muted))))
   \`(org-level-1 ((t (:foreground ,purple :height 1.0))))
   \`(org-level-2 ((t (:foreground ,blue :height 1.0))))
   \`(org-level-3 ((t (:foreground ,green :height 1.0))))
   \`(org-level-4 ((t (:foreground ,purple :height 1.0))))
   \`(org-level-5 ((t (:foreground ,blue :height 1.0))))
   \`(org-level-6 ((t (:foreground ,green :height 1.0))))
   \`(org-level-7 ((t (:foreground ,purple :height 1.0))))
   \`(org-level-8 ((t (:foreground ,blue :height 1.0))))
   \`(org-level-9 ((t (:foreground ,green :height 1.0))))
   \`(org-tag ((t (:foreground ,fg_muted :slant italic))))
   \`(org-verbatim ((t (:foreground ,red :slant italic))))
   \`(org-code ((t (:foreground ,yellow :background ,overlay))))
   \`(org-block ((t (:background ,overlay))))
   \`(org-block-begin-line ((t (:background ,overlay :foreground ,fg_muted :slant italic))))
   \`(org-block-end-line ((t (:background ,overlay :foreground ,fg_muted :slant italic))))
   \`(org-drawer ((t (:foreground ,fg_muted))))
   \`(org-special-keyword ((t (:foreground ,fg_muted))))
   \`(org-property-value ((t (:foreground ,fg_muted))))
   \`(org-done ((t (:foreground ,fg_muted))))
   \`(org-headline-done ((t (:foreground ,fg_muted))))
   \`(org-table ((t (:foreground ,blue))))
   ; Date-related
   \`(org-date ((t (:foreground ,yellow))))
   \`(org-time-grid ((t (:foreground ,yellow))))
   \`(org-scheduled ((t (:foreground ,fg))))
   \`(org-scheduled-today ((t (:foreground ,fg))))
   \`(org-scheduled-previously ((t (:foreground ,orange))))
   \`(org-imminent-deadline ((t (:foreground ,red))))
   \`(org-upcoming-deadline ((t (:foreground ,yellow))))
   \`(org-upcoming-distant-deadline ((t (:foreground ,yellow))))
   ; Agenda
   \`(org-agenda-done ((t (:foreground ,fg_muted))))
   \`(org-agenda-structure ((t (:foreground ,blue))))
   ; Habit
   \`(org-habit-ready-face ((t (:background ,green_bg :foreground ,fg))))
   \`(org-habit-overdue-face ((t (:background ,red_bg :foreground ,fg))))
   \`(org-habit-clear-future-face ((t (:background ,raised :foreground ,fg))))
   \`(org-habit-clear-face ((t (:background ,green_bg :foreground ,fg))))
   \`(org-habit-alert-future-face ((t (:background ,red_bg :foreground ,fg))))
   \`(org-habit-alert-face ((t (:background ,yellow_bg :foreground ,fg))))

   ;; Treemacs
   ; Structure
   \`(treemacs-root-face ((t (:foreground ,purple :weight bold :height 1.1))))
   \`(treemacs-root-unreadable-face ((t (:foreground ,fg_muted :weight bold :height 1.1 :strike-through t))))
   \`(treemacs-directory-face ((t (:foreground ,fg))))
   \`(treemacs-directory-collapsed-face ((t (:foreground ,fg_muted))))
   \`(treemacs-file-face ((t (:foreground ,fg))))
   \`(treemacs-tags-face ((t (:foreground ,purple))))
   \`(treemacs-term-node-face ((t (:foreground ,yellow))))
   ; nerd-icons theme faces -- default to orange, which fights the palette
   \`(treemacs-nerd-icons-root-face ((t (:foreground ,purple))))
   \`(treemacs-nerd-icons-file-face ((t (:foreground ,fg_muted))))
   ; Window chrome -- base bg matches what solaire-global-mode gives side windows
   \`(treemacs-window-background-face ((t (:background ,base))))
   \`(treemacs-hl-line-face ((t (:background ,selection :extend t))))
   \`(treemacs-fringe-indicator-face ((t (:foreground ,purple))))
   \`(treemacs-header-button-face ((t (:foreground ,purple :weight bold))))
   ; Git status -- these must not collide with each other or with plain files
   \`(treemacs-git-unmodified-face ((t (:foreground ,fg))))
   \`(treemacs-git-modified-face ((t (:foreground ,${n("git.modified")}))))
   \`(treemacs-git-added-face ((t (:foreground ,${n("git.added")}))))
   \`(treemacs-git-untracked-face ((t (:foreground ,${n("git.untracked")}))))
   \`(treemacs-git-renamed-face ((t (:foreground ,${n("git.renamed")}))))
   \`(treemacs-git-ignored-face ((t (:foreground ,${n("git.ignored")}))))
   \`(treemacs-git-conflict-face ((t (:foreground ,${n("git.conflict")} :weight bold))))
   \`(treemacs-git-commit-diff-face ((t (:foreground ,fg_muted :slant italic))))
   ; Feedback
   \`(treemacs-marked-file-face ((t (:background ,red_bg :foreground ,yellow :weight bold))))
   \`(treemacs-on-success-pulse-face ((t (:background ,green_bg :foreground ,fg :extend t))))
   \`(treemacs-on-failure-pulse-face ((t (:background ,red_bg :foreground ,fg :extend t))))
   \`(treemacs-peek-mode-indicator-face ((t (:background ,green_bg :foreground ,fg))))
   \`(treemacs-async-loading-face ((t (:foreground ,fg_muted :slant italic :height 0.8))))
   ; Help buffer
   \`(treemacs-help-title-face ((t (:foreground ,purple :weight bold))))
   \`(treemacs-help-column-face ((t (:foreground ,yellow :weight bold :underline t))))

  ))

;;;###autoload
(when load-file-name
  (add-to-list 'custom-theme-load-path
               (file-name-as-directory (file-name-directory load-file-name))))

(provide-theme 'bytemancer)
;;; bytemancer-theme.el ends here
`;

  return [{ path: "emacs/bytemancer-theme.el", content }];
}

export const emacs: Template = { render };
