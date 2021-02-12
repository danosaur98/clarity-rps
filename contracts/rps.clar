;; Clarity contract for playing rock paper scissors

;; "R" for rock, "P" for paper, "S" for scissors
;; rock beats paper, paper beats scissors, scissors beats rock
(define-data-var player-1-choice (string-ascii 1) "R")

(define-data-var player-2-choice (string-ascii 1) "R")

;; set player 1 choice if valid choice is inputted
(define-public (pick-player-1-choice (choice (string-ascii 1)))
    (if
        (or (is-eq choice "R")
            (is-eq choice "P")
            (is-eq choice "S")
        )
            (ok (var-set player-1-choice choice))
            (err "invalid choice")
    )
)

;; set player 2 choice if valid choice is inputted
(define-public (pick-player-2-choice (choice (string-ascii 1)))
    (if
        (or (is-eq choice "R")
            (is-eq choice "P")
            (is-eq choice "S")
        )
            (ok (var-set player-2-choice choice))
            (err "invalid choice")
    )
)

;; determine winner based on player-1-choice and player-2-choice
(define-public (determine-winner)
    (if
        (or 
            (and (is-eq (var-get player-1-choice) "R")
                (is-eq (var-get player-2-choice) "R")
            )
            (and (is-eq (var-get player-1-choice) "P")
                (is-eq (var-get player-2-choice) "P")
            )
            (and (is-eq (var-get player-1-choice) "S")
                (is-eq (var-get player-2-choice) "S")
            )
        )
        (ok 0)
        (if 
            (or 
                (and (is-eq (var-get player-1-choice) "R")
                    (is-eq (var-get player-2-choice) "S")
                )
                (and (is-eq (var-get player-1-choice) "P")
                    (is-eq (var-get player-2-choice) "R")
                )
                (and (is-eq (var-get player-1-choice) "S")
                    (is-eq (var-get player-2-choice) "P")
                )
            )
            (ok 1)
            (if 
                (or
                    (and (is-eq (var-get player-1-choice) "R")
                        (is-eq (var-get player-2-choice) "P")
                    )
                    (and (is-eq (var-get player-1-choice) "P")
                        (is-eq (var-get player-2-choice) "S")
                    )
                    (and (is-eq (var-get player-1-choice) "S")
                        (is-eq (var-get player-2-choice) "R")
                    )
                )
                (ok 2)
                (ok 0)
            )
        )
    )
)

(define-public (get-player-1-choice)
    (ok (var-get player-1-choice))
)

(define-public (get-player-2-choice)
    (ok (var-get player-2-choice))
)
